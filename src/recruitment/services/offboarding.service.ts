import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TerminationRequest, TerminationRequestDocument } from '../models/termination-request.schema';
import { CreateTerminationRequestDto } from 'src/recruitment/dto/create-termination-request.dto';
import { UpdateTerminationRequestDto } from 'src/recruitment/dto/update-termination-request.dto';
import { ClearanceChecklist, ClearanceChecklistDocument } from 'src/recruitment/models/clearance-checklist.schema';
import { CreateClearanceChecklistDto } from 'src/recruitment/dto/create-clearance-checklist.dto';
import { UpdateClearanceChecklistDto } from 'src/recruitment/dto/update-clearance-checklist.dto';

@Injectable()
export class OffboardingService {

  // termination request services

  constructor(
    @InjectModel(TerminationRequest.name)
    private terminationRequestModel: Model<TerminationRequestDocument>,

    @InjectModel(ClearanceChecklist.name)
    private clearanceChecklistModel: Model<ClearanceChecklistDocument>,
  ) {}

  async createTerminationRequest(terminationRequestData: CreateTerminationRequestDto,
  ): Promise<TerminationRequestDocument> {
    const newTerminationRequest = new this.terminationRequestModel(terminationRequestData);
    return newTerminationRequest.save();
  }

  async getAllTerminationRequests(): Promise<TerminationRequestDocument[]> {
    return this.terminationRequestModel.find().exec();
  }

  async getTerminationRequest(id: string): Promise<TerminationRequestDocument> {
    const terminationRequest = await this.terminationRequestModel.findById(id).exec();
    if (!terminationRequest) {
      throw new NotFoundException('Termination request not found');
    }
    return terminationRequest;
  }

  async updateTerminationRequest( id: string,terminationRequestData: UpdateTerminationRequestDto,): Promise<TerminationRequestDocument> {

    // Update the termination request
    const updatedTerminationRequest = await this.terminationRequestModel.findByIdAndUpdate(
      id,
      terminationRequestData,
      { new: true },
    );

    if (!updatedTerminationRequest) {
      throw new NotFoundException('Termination request not found');
    }
    
    //NEED OTHER SUBS HERE

    // const currentTerminationRequest = await this.terminationRequestModel.findById(id).exec();
    // if (!currentTerminationRequest) {
    //   throw new NotFoundException('Termination request not found');
    // }
    //const employeeId = updatedTerminationRequest.employeeId.toString();

    // Notify when termination request is approved
    // if (
    //   currentTerminationRequest.status !== TerminationStatus.APPROVED &&
    //   updatedTerminationRequest.status === TerminationStatus.APPROVED
    // ) {
    //   // Update employee status to TERMINATED
    //   await this.employeeProfileService.updateEmployeeProfile(employeeId, {
    //     status: EmployeeStatus.TERMINATED,
    //     statusEffectiveFrom: updatedTerminationRequest.terminationDate || new Date(),
    //   });

      // Delete employee system role
      //await this.employeeSystemRoleService.deleteEmployeeSystemRole(employeeId);

      // Notify employee about approval
    //   await this.createNotification({
    //     recipientId: employeeId,
    //     recipientModel: 'EmployeeProfile',
    //     notificationMessageTitle: 'Resignation Request Approved',
    //     notificationBody: `Your resignation request has been approved. Your last working day will be ${
    //       updatedTerminationRequest.terminationDate 
    //         ? new Date(updatedTerminationRequest.terminationDate).toLocaleDateString() 
    //         : 'to be determined'
    //     }.`,
    //   });
    // }

    // Notify when termination request is rejected
    // if (
    //   currentTerminationRequest.status !== TerminationStatus.REJECTED &&
    //   updatedTerminationRequest.status === TerminationStatus.REJECTED
    // ) {
    //   await this.createNotification({
    //     recipientId: employeeId,
    //     recipientModel: 'EmployeeProfile',
    //     notificationMessageTitle: 'Resignation Request Update',
    //     notificationBody: 'Your resignation request has been reviewed. Please contact HR for more information.',
    //   });
    // }

    // Notify when termination request is under review (pending to in_review)
    // if (
    //   currentTerminationRequest.status === TerminationStatus.PENDING &&
    //   updatedTerminationRequest.status === TerminationStatus.IN_REVIEW
    // ) {
    //   await this.createNotification({
    //     recipientId: employeeId,
    //     recipientModel: 'EmployeeProfile',
    //     notificationMessageTitle: 'Resignation Request Under Review',
    //     notificationBody: 'Your resignation request is now being reviewed by HR.',
    //   });
    //}

    return updatedTerminationRequest;
  }

  //termination checklist services

  async createClearanceChecklist(
    clearanceChecklistData: CreateClearanceChecklistDto,
  ): Promise<ClearanceChecklistDocument> {
    const newClearanceChecklist = new this.clearanceChecklistModel(clearanceChecklistData);
    return newClearanceChecklist.save();
  }

  async getAllClearanceChecklists(): Promise<ClearanceChecklistDocument[]> {
    return this.clearanceChecklistModel.find().exec();
  }

  async getClearanceChecklist(id: string): Promise<ClearanceChecklistDocument> {
    const clearanceChecklist = await this.clearanceChecklistModel.findById(id).exec();
    if (!clearanceChecklist) {
      throw new NotFoundException('Clearance checklist not found');
    }
    return clearanceChecklist;
  }

  async updateClearanceChecklist(
    id: string,
    clearanceChecklistData: UpdateClearanceChecklistDto,
  ): Promise<ClearanceChecklistDocument> {
    const updatedClearanceChecklist = await this.clearanceChecklistModel.findByIdAndUpdate(
      id,
      clearanceChecklistData,
      { new: true },
    );
    if (!updatedClearanceChecklist) {
      throw new NotFoundException('Clearance checklist not found');
    }
    return updatedClearanceChecklist;
  }

  async deleteClearanceChecklist(id: string): Promise<ClearanceChecklistDocument> {
    const deletedClearanceChecklist = await this.clearanceChecklistModel.findByIdAndDelete(id);
    if (!deletedClearanceChecklist) {
      throw new NotFoundException('Clearance checklist not found');
    }
    return deletedClearanceChecklist;
  }

}