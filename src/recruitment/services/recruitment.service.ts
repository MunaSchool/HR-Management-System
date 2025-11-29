import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateJobOfferDto } from '../dto/create-job-offer.dto';
import { UpdateJobOfferDto } from '../dto/update-job-offer.dto';
import { Offer, OfferDocument } from 'src/recruitment/models/offer.schema';
import { CreateReferralDto } from 'src/recruitment/dto/create-referral.dto';
import { Referral, ReferralDocument } from 'src/recruitment/models/referral.schema';
import { CreateInterviewDto } from 'src/recruitment/dto/create-interview.dto';
import { UpdateInterviewDto } from '../dto/update-interview.dto';
import { Interview, InterviewDocument } from 'src/recruitment/models/interview.schema';
import { CreateFeedbackDto } from 'src/recruitment/dto/create-feedback.dto';
import { AssessmentResult, AssessmentResultDocument } from 'src/recruitment/models/assessment-result.schema';
import { UpdateFeedbackDto } from 'src/recruitment/dto/update-feedback.dto';
import { CreateApplicationDto } from 'src/recruitment/dto/create-application.dto';
import { UpdateApplicationDto } from 'src/recruitment/dto/update-application.dto';
import { Application, ApplicationDocument } from 'src/recruitment/models/application.schema';
import { JobTemplate, JobTemplateDocument } from 'src/recruitment/models/job-template.schema';
import { JobRequisition, JobRequisitionDocument } from 'src/recruitment/models/job-requisition.schema';
import { CreateJobTemplateDto } from 'src/recruitment/dto/create-job-template.dto';
import { CreateJobRequisitionDto } from 'src/recruitment/dto/create-job-requisition.dto';
import { Onboarding, OnboardingDocument } from 'src/recruitment/models/onboarding.schema';
import { ApplicationStatus } from 'src/recruitment/enums/application-status.enum';
import { Contract, ContractDocument } from 'src/recruitment/models/contract.schema';
import { NotificationLogService } from 'src/time-management/services/notification-log.service';
@Injectable()
export class RecruitmentService {
  constructor(
    @InjectModel(Offer.name)
    private readonly offerModel: Model<OfferDocument>,

    @InjectModel(Referral.name)
    private readonly referralModel: Model<ReferralDocument>,

    @InjectModel(Interview.name)
    private readonly interviewModel: Model<InterviewDocument>,

    @InjectModel(AssessmentResult.name)
    private readonly assessmentResultModel: Model<AssessmentResultDocument>,

    @InjectModel(Application.name)
    private readonly applicationModel: Model<ApplicationDocument>,

    @InjectModel(JobTemplate.name)
    private readonly jobTemplateModel: Model<JobTemplateDocument>,

    @InjectModel(JobRequisition.name)
    private readonly jobRequisitionModel: Model<JobRequisitionDocument>,

    @InjectModel(Onboarding.name)
    private readonly onboardingModel: Model<OnboardingDocument>,

    @InjectModel(Contract.name)
    private readonly contractModel: Model<ContractDocument>,

    // Only inject NotificationService, NOT the Notification model
    private readonly notificationLogService: NotificationLogService,
  ) {}

  // offer services

  async createOffer(jobOfferData: CreateJobOfferDto): Promise<OfferDocument> {
    const newOffer = new this.offerModel(jobOfferData);
    return newOffer.save();
  }

  async getAllOffers(): Promise<OfferDocument[]> {
    return this.offerModel.find().exec();
  }

  async getOffer(id: string): Promise<OfferDocument> {
    const offer = await this.offerModel.findById(id).exec();
    if (!offer) throw new NotFoundException('offer not found');
    return offer;
  }

  async updateOffer(id: string, jobOfferData: UpdateJobOfferDto): Promise<OfferDocument> {
    const updateOffer = await this.offerModel.findByIdAndUpdate(id, jobOfferData, { new: true });
    if (!updateOffer) throw new NotFoundException('offer not found');
    return updateOffer;
  }

  //referral services

  async createReferral(referralData: CreateReferralDto): Promise<ReferralDocument> {
    const newReferral = new this.referralModel(referralData);
    return newReferral.save();
  }

  async getReferral(id: string): Promise<ReferralDocument> {
    const referral = await this.referralModel.findById(id).exec();
    if (!referral) throw new NotFoundException('referral not found');
    return referral;
  }

  //interview services

  async createInterview(interviewData: CreateInterviewDto): Promise<InterviewDocument> {
    const newInterview = new this.interviewModel(interviewData);

    // Get application to find candidateId
    const application = await this.applicationModel.findById(newInterview.applicationId).exec();
    if (!application) throw new NotFoundException('Application not found');

    //  Use notificationService instead of this.createNotification
    // await this.notificationService.createNotification({
    //   recipientId: application.candidateId.toString(),
    //   recipientModel: 'Candidate',
    //   notificationMessageTitle: 'Interview Details',
    //   notificationBody: `Your interview has been set.\nDate: ${newInterview.scheduledDate}\nInterview method: ${newInterview.method}`,
    // });

    return newInterview.save();
  }

  async getAllInterviews(): Promise<InterviewDocument[]> {
    return this.interviewModel.find().exec();
  }

  async getInterview(id: string): Promise<InterviewDocument> {
    const interview = await this.interviewModel.findById(id).exec();
    if (!interview) throw new NotFoundException('interview not found');
    return interview;
  }

  async updateInterview(id: string, interviewData: UpdateInterviewDto): Promise<InterviewDocument> {
    const updatedInterview = await this.interviewModel.findByIdAndUpdate(id, interviewData, { new: true });
    if (!updatedInterview) throw new NotFoundException('interview not found');
    return updatedInterview;
  }

  //feedback services

  async createFeedback(feedbackData: CreateFeedbackDto): Promise<AssessmentResultDocument> {
    const newFeedback = new this.assessmentResultModel(feedbackData);
    return newFeedback.save();
  }

  async getAllFeedback(): Promise<AssessmentResultDocument[]> {
    return this.assessmentResultModel.find().exec();
  }

  async getFeedback(id: string): Promise<AssessmentResultDocument> {
    const feedback = await this.assessmentResultModel.findById(id).exec();
    if (!feedback) throw new NotFoundException('feedback not found');
    return feedback;
  }

  async updateFeedback(id: string, feedbackData: UpdateFeedbackDto): Promise<AssessmentResultDocument> {
    const updatedFeedback = await this.assessmentResultModel.findByIdAndUpdate(id, feedbackData, { new: true });
    if (!updatedFeedback) throw new NotFoundException('feedback not found');
    return updatedFeedback;
  }

  //notification services - wrapper methods

  // async createNotification(notificationData: any) {
  //   return this.notificationService.createNotification(notificationData);
  // }

  // async getAllNotifications() {
  //   return this.notificationService.getAllNotifications();
  // }

  // async getNotificationById(id: string) {
  //   return this.notificationService.getNotificationById(id);
  // }

  //application services

  async findByEmployeeId(employeeId: string): Promise<OnboardingDocument> {
    const onboarding = await this.onboardingModel.findOne({ employeeId });
    if (!onboarding) throw new NotFoundException('Onboarding not found');
    return onboarding;
  }


  async createApplication(applicationData: CreateApplicationDto): Promise<ApplicationDocument> {
    const newApplication = new this.applicationModel(applicationData);

    // Use notificationLogService
    await this.notificationLogService.sendNotification({
      to: newApplication.candidateId,
      type: 'Application Submitted',
      message: 'Your application has been successfully submitted.',
    });

    return newApplication.save();
  }

  async getAllApplications(): Promise<ApplicationDocument[]> {
    return this.applicationModel.find().exec();
  }

  async getApplication(id: string): Promise<ApplicationDocument> {
    const application = await this.applicationModel.findById(id).exec();
    if (!application) throw new NotFoundException('application not found');
    return application;
  }

  async updateApplication(id: string, applicationData: UpdateApplicationDto): Promise<ApplicationDocument> {
  const currentApplication = await this.applicationModel.findById(id);
  if (!currentApplication) throw new NotFoundException('Application not found');

  const updatedApplication = await this.applicationModel.findByIdAndUpdate(id, applicationData, { new: true });
  if (!updatedApplication) throw new NotFoundException('Application not found');

  // Notification 1: HR Assigned
  if (!currentApplication.assignedHr && updatedApplication.assignedHr) {
    await this.notificationLogService.sendNotification({
      to: updatedApplication.candidateId,
      type: 'Application In Process',
      message: 'Your application is now being reviewed by our HR team.',
    });
  }

  const hrId = updatedApplication.assignedHr;

    // Notification 2: Offer Status
  if (currentApplication.status !== ApplicationStatus.OFFER && updatedApplication.status === ApplicationStatus.OFFER && hrId != null) {
    const offer = await this.offerModel.findOne({ applicationId: updatedApplication._id }).exec();

    if (!offer) {
      throw new NotFoundException('Offer not found for this application');
    }

    const contract = await this.contractModel.findOne({ offerId: offer._id }).exec();

    await this.notificationLogService.sendNotification({
      to: updatedApplication.candidateId,
      type: 'Job Offer',
      message: `Congratulations! Please review your offer and contract.${contract ? ` Contract ID: ${contract._id}` : ''}`,
    }); 
  }

  // Notification 3: Rejected Status
  if (currentApplication.status !== ApplicationStatus.REJECTED && updatedApplication.status === ApplicationStatus.REJECTED) {
    await this.notificationLogService.sendNotification({
      to: updatedApplication.candidateId,
      type: 'Application Update',
      message: 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.',
    });
  }

  return updatedApplication;
}

  //template services

  async createJobTemplate(jobTemplateData: CreateJobTemplateDto): Promise<JobTemplateDocument> {
    const newJobTemplate = new this.jobTemplateModel(jobTemplateData);
    return newJobTemplate.save();
  }

  async getAllJobTemplates(): Promise<JobTemplateDocument[]> {
    return this.jobTemplateModel.find().exec();
  }

  async getJobTemplate(id: string): Promise<JobTemplateDocument> {
    const template = await this.jobTemplateModel.findById(id).exec();
    if (!template) throw new NotFoundException('template not found');
    return template;
  }

  async updateJobTemplate(templateId: string, dto: Partial<CreateJobTemplateDto>): Promise<JobTemplateDocument> {
    const updatedTemplate = await this.jobTemplateModel.findByIdAndUpdate(templateId, dto, {
      new: true,
      runValidators: true,
    });
    if (!updatedTemplate) throw new NotFoundException('template not found');
    return updatedTemplate;
  }

  async deleteJobTemplate(id: string): Promise<JobTemplateDocument> {
    const deletedTemplate = await this.jobTemplateModel.findByIdAndDelete(id).exec();
    if (!deletedTemplate) throw new NotFoundException('template not found');
    return deletedTemplate;
  }

  //requisition services

  async createJobRequisition(requisitionData: CreateJobRequisitionDto, templateId: string): Promise<JobRequisitionDocument> {
    const template = await this.jobTemplateModel.findById(templateId);
    if (!template) throw new NotFoundException('template not found');

    const newRequisition = new this.jobRequisitionModel({
      ...requisitionData,
      templateId,
    });

    return newRequisition.save();
  }

  async getAllJobRequisitions(): Promise<JobRequisitionDocument[]> {
    return this.jobRequisitionModel.find().populate('templateId').exec();
  }

  async getJobRequisition(id: string): Promise<JobRequisitionDocument> {
    const requisition = await this.jobRequisitionModel.findById(id).populate('templateId').exec();
    if (!requisition) throw new NotFoundException('requisition not found');
    return requisition;
  }

  async updateJobRequisition(requisitionId: string, dto: Partial<CreateJobRequisitionDto>): Promise<JobRequisitionDocument> {
    const updatedRequisition = await this.jobRequisitionModel.findByIdAndUpdate(requisitionId, dto, {
      new: true,
      runValidators: true,
    });
    if (!updatedRequisition) throw new NotFoundException('requisition not found');
    return updatedRequisition;
  }

  async deleteJobRequisition(id: string): Promise<JobRequisitionDocument> {
    const deletedRequisition = await this.jobRequisitionModel.findByIdAndDelete(id).exec();
    if (!deletedRequisition) throw new NotFoundException('requisition not found');
    return deletedRequisition;
  }
}