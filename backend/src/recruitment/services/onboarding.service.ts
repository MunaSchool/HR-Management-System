import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Onboarding, OnboardingDocument } from '../models/onboarding.schema';
import { Contract, ContractDocument } from '../models/contract.schema';
import { CreateOnboardingTaskDto } from '../dto/create-onboarding-task.dto';
import { UpdateOnboardingTaskDto } from '../dto/update-onboarding-task.dto';
//import { OnboardingTaskStatus } from 'src/enums/onboarding-task-status.enum';
import { NotificationLogService } from 'src/time-management/services/notification-log.service'; 
import { Offer , OfferDocument } from '../models/offer.schema';
import { CreateContractDto } from '../dto/create-onboarding-contract.dto';
import { UpdateContractDto } from '../dto/update-onboarding-contract.dto';
import { CreateOnboardingDocumentDto } from '../dto/create-onboarding-document.dto';
import { UpdateOnboardingDocumentDto } from '../dto/update-onboarding-document.dto';
import { DocumentDocument } from '../models/document.schema';
import { Application , ApplicationDocument} from '../models/application.schema';
import { ApplicationStatus } from '../enums/application-status.enum';
import { Document } from '../models/document.schema';
//ERRORS WILL DISSAPEAR ONCE ALL IS MERGED INTO MAIN -DO NOT REMOVE ANYTHING
import { EmployeeProfileService } from 'src/employee-profile/employee-profile.service';
import { EmployeeStatus, SystemRole } from 'src/employee-profile/enums/employee-profile.enums';
import { PayrollExecutionService } from 'src/payroll-execution/payroll-execution.service';
import { payrollRuns } from 'src/payroll-execution/models/payrollRuns.schema';
import { employeePayrollDetails } from 'src/payroll-execution/models/employeePayrollDetails.schema';
import { employeeSigningBonus } from 'src/payroll-execution/models/EmployeeSigningBonus.schema';
import { signingBonus } from 'src/payroll-configuration/models/signingBonus.schema';
//import { PayrollExecutionService } from 'src/external-controller-services/services/payroll-execution-service.service';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectModel(Onboarding.name)
    private readonly onboardingModel: Model<OnboardingDocument>,
    
    @InjectModel(Contract.name)
    private readonly contractModel: Model<ContractDocument>,

    @InjectModel(Offer.name)
    private readonly offerModel: Model<OfferDocument>,

    @InjectModel(Document.name)
    private readonly documentModel: Model<DocumentDocument>,

    @InjectModel(Application.name)
    private readonly applicationModel: Model<ApplicationDocument>,

    @InjectModel(employeeSigningBonus.name)
    private readonly employeeSigningBonusModel: Model<employeeSigningBonus>,

    @InjectModel(employeePayrollDetails.name)
    private readonly employeePayrollDetailsModel: Model<employeePayrollDetails>,

    @InjectModel(payrollRuns.name)
    private readonly payrollRunsModel: Model<payrollRuns>,

    @InjectModel(signingBonus.name)
    private readonly signingBonusConfigModel: Model<signingBonus>,
    
    private readonly notificationLogService: NotificationLogService,

    private readonly employeeCrudService: EmployeeProfileService ,

    private readonly payrollExectutionService : PayrollExecutionService ,

  ) {}

  // contract related services

  async createContract(contractData: CreateContractDto): Promise<ContractDocument> {
    const newContract = new this.contractModel(contractData);
    return newContract.save();
  }

  async getAllContracts(): Promise<ContractDocument[]> {
    return this.contractModel.find().populate('offerId').populate('documentId').exec();
  }

  async getContractById(contractId: string): Promise<ContractDocument> {
    const contract = await this.contractModel.findById(contractId).populate('offerId').populate('documentId').exec();

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${contractId} not found`);
    }

    return contract;
  }

  
  async updateContract(contractId: string, contractData: UpdateContractDto): Promise<ContractDocument> {
    const currentContract = await this.contractModel.findById(contractId);
    if (!currentContract) {
      throw new NotFoundException(`Contract with ID ${contractId} not found`);
    }

    const updatedContract = await this.contractModel.findByIdAndUpdate(contractId, contractData, { new: true });

    if (!updatedContract) {
      throw new NotFoundException(`Contract with ID ${contractId} not found`);
    }

    // Get offer details
    const offer = await this.offerModel.findById(currentContract.offerId).exec();
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    const candidateID = offer.candidateId;
    const hrManagerID = offer.hrEmployeeId;

    // Trigger: Check if employee signed
    if (!currentContract.employeeSignedAt && updatedContract.employeeSignedAt) {
      await this.notificationLogService.sendNotification({
        to: hrManagerID,
        type: 'Contract Signed by Employee',
        message: `Employee has signed the contract for offer ${updatedContract.offerId}`,
      });
    }

    // Trigger: Check if employer signed
    if (!currentContract.employerSignedAt && updatedContract.employerSignedAt) {
      await this.notificationLogService.sendNotification({
        to: candidateID,
        type: 'Contract Fully Executed',
        message: 'Your employment contract has been fully signed. Welcome aboard!',
      });
    }

    // Trigger: Both signatures complete - update to HIRED and trigger all systems
    if (
      updatedContract.employeeSignedAt &&
      updatedContract.employerSignedAt &&
      (!currentContract.employeeSignedAt || !currentContract.employerSignedAt)
    ) {
      const application = await this.applicationModel.findById(offer.applicationId);
      if (application) {
        await this.applicationModel.findByIdAndUpdate(
          offer.applicationId,
          { status: ApplicationStatus.HIRED },
          { new: true }
        );

        // 1. CREATE SIGNING BONUS RECORD IF CONTRACT HAS SIGNING BONUS
        if (updatedContract.signingBonus && updatedContract.signingBonus > 0) {
          // Find the active/approved signing bonus template from payroll config
          const signingBonusConfig = await this.signingBonusConfigModel
            .findOne({
              status: 'APPROVED',
            })
            .sort({ createdAt: -1 })
            .exec();

          if (!signingBonusConfig) {
            throw new NotFoundException('No approved signing bonus configuration found');
          }

          const signingBonusRecord = await this.employeeSigningBonusModel.create({
            employeeId: candidateID,
            signingBonusId: signingBonusConfig._id,
            givenAmount: updatedContract.signingBonus,
            paymentDate: null,
            status: 'PENDING',
          });

          // Notify payroll to review signing bonus
          await this.notificationLogService.sendNotification({
            to: hrManagerID,
            type: 'Signing Bonus Approval Required',
            message: `New hire signing bonus of ${updatedContract.signingBonus} requires approval for employee ${candidateID}`,
          });
        }

        // 2. HANDLE PAYROLL CYCLE START DATE
        const currentDate = new Date();
        const currentPayrollRun = await this.payrollRunsModel.findOne({
          payrollPeriod: {
            $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
          },
          status: { $in: ['DRAFT', 'IN_PROGRESS'] },
        });

        if (currentPayrollRun) {
          await this.employeePayrollDetailsModel.create({
            employeeId: candidateID,
            payrollRunId: currentPayrollRun._id,
            baseSalary: updatedContract.grossSalary,
            allowances: 0,
            deductions: 0,
            netSalary: updatedContract.grossSalary,
            netPay: updatedContract.grossSalary,
            bankStatus: 'MISSING',
            bonus: updatedContract.signingBonus || 0,
            benefit: 0,
            exceptions: `New hire - Start date: ${updatedContract.employerSignedAt}`,
          });
        }

        // Equipment and system setup notifications
        await this.notificationLogService.sendNotification({
          to: hrManagerID,
          type: 'New Hire Equipment Setup Required',
          message: `New hire equipment and workspace setup needed for employee ID: ${offer.candidateId}. Please reserve: desk, laptop, access card, and other equipment.`,
        });

        await this.notificationLogService.sendNotification({
          to: hrManagerID,
          type: 'System Access Provisioning Required',
          message: `New hire requires system access provisioning for employee ID: ${offer.candidateId}. Please set up: Email account, Payroll system access, Internal systems access, VPN credentials, and other required system permissions.`,
        });

        await this.notificationLogService.sendNotification({
          to: hrManagerID,
          type: 'Email Account Setup Required',
          message: `Please create email account and configure access for new hire (Employee ID: ${offer.candidateId}). Ensure email is active before Day 1.`,
        });

        await this.notificationLogService.sendNotification({
          to: hrManagerID,
          type: 'Payroll System Access Required',
          message: `New hire needs payroll system access (Employee ID: ${offer.candidateId}). Please provision account and send credentials securely.`,
        });

        await this.notificationLogService.sendNotification({
          to: candidateID,
          type: 'Welcome! System Setup in Progress',
          message: 'Welcome to the team! Our IT team is setting up your email, payroll access, and internal systems. You will receive your credentials before your start date.',
        });
      }
    }

    return updatedContract;
  }

  //document services - will allow upload and get

  async createOnboardingDocument(documentData: CreateOnboardingDocumentDto): Promise<DocumentDocument> {
    const newDocument = new this.documentModel(documentData);
    return newDocument.save();
  }

  async getAllOnboardingDocuments(): Promise<DocumentDocument[]> {
    return this.documentModel.find().exec();
  }

  async getOnboardingDocument(id: string): Promise<DocumentDocument> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) throw new NotFoundException('Onboarding document not found');
    return document;
  }

  async getDocumentsByCandidate(candidateId: string): Promise<DocumentDocument[]> {
    return this.documentModel.find({ candidateId }).exec();
  }

  async getDocumentsByEmployee(employeeId: string): Promise<DocumentDocument[]> {
  return this.documentModel.find({ employeeId }).exec();
}

  async updateOnboardingDocument(id: string,documentData: UpdateOnboardingDocumentDto): Promise<DocumentDocument> {
    const updatedDocument = await this.documentModel.findByIdAndUpdate(id,documentData,{ new: true, runValidators: true });

    if (!updatedDocument)
      throw new NotFoundException('Onboarding document not found');

    return updatedDocument;
  }

  async deleteOnboardingDocument(id: string): Promise<DocumentDocument> {
    const deletedDocument = await this.documentModel.findByIdAndDelete(id).exec();

    if (!deletedDocument)
      throw new NotFoundException('Onboarding document not found');

    return deletedDocument;
  }

  // onboarding task services

  async createOnboardingTask(createOnboardingDto: CreateOnboardingTaskDto): Promise<OnboardingDocument> {

    const onboarding = await this.onboardingModel.create(createOnboardingDto);

    return onboarding;

  }

  async getAllTasks(): Promise<OnboardingDocument[]> {

    return this.onboardingModel.find()/*.populate('employeeId')*/.exec();
  }

  async getTaskById(taskId: string): Promise<OnboardingDocument> {
    const onboarding = await this.onboardingModel.findById(taskId)/*.populate('employeeId')*/.exec();

    if (!onboarding) {
      throw new NotFoundException(`Onboarding record with ID ${taskId} not found`);
    }

    return onboarding;
  }

  async updateOnboardingTask(id: string, updateOnboardingDto: UpdateOnboardingTaskDto): Promise<OnboardingDocument> {

    const updatedOnboarding = await this.onboardingModel.findByIdAndUpdate(id,updateOnboardingDto,{ new: true });

    if (!updatedOnboarding) throw new NotFoundException('Onboarding not found');



    return updatedOnboarding;

  }

  async deleteTask(taskId: string, taskIndex: number): Promise<OnboardingDocument> {
    const onboarding = await this.onboardingModel.findById(taskId);

    if (!onboarding) {
      throw new NotFoundException(`Onboarding record with ID ${taskId} not found`);
    }

    if (taskIndex < 0 || taskIndex >= onboarding.tasks.length) {
      throw new BadRequestException('Invalid task index');
    }

    // Remove task from array
    onboarding.tasks.splice(taskIndex, 1);

    return onboarding.save();
  }

  async deleteOnboardingRecord(onboardingId: string): Promise<void> {
    const result = await this.onboardingModel.findByIdAndDelete(onboardingId);
    if (!result) {
      throw new NotFoundException(`Onboarding record with ID ${onboardingId} not found`);
    }
  }
}


//extras

// async deleteContract(contractId: string): Promise<void> {
//   const result = await this.contractModel.findByIdAndDelete(contractId);
//   if (!result) {
//     throw new NotFoundException(`Contract with ID ${contractId} not found`);
//   }
// }

// async getTasksByEmployee(employeeId: string): Promise<OnboardingDocument> {
//   const onboarding = await this.onboardingModel.findOne({ employeeId: new Types.ObjectId(employeeId) }).populate('employeeId').exec();

//   if (!onboarding) {
//     throw new NotFoundException(`Onboarding record for employee ${employeeId} not found`);
//   }

//   return onboarding;
// }