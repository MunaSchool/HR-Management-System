import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Candidate, CandidateDocument } from '../models/candidate.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CandidateRegistrationService {
  constructor(
    @InjectModel(Candidate.name)
    private candidateModel: Model<CandidateDocument>,
  ) {}

  /**
   * Register a new candidate user
   * This allows candidates to create their own account in the system
   */
  async registerCandidate(registerDto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
  }) {
    // Validate required fields
    if (!registerDto.email || !registerDto.password || !registerDto.firstName || !registerDto.lastName) {
      throw new BadRequestException('Email, password, first name, and last name are required');
    }

    // Check if candidate with this email already exists
    const existingCandidate = await this.candidateModel.findOne({
      email: registerDto.email.toLowerCase()
    }).exec();

    if (existingCandidate) {
      throw new ConflictException('A candidate with this email already exists');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create new candidate
    const candidate = await this.candidateModel.create({
      email: registerDto.email.toLowerCase(),
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phoneNumber: registerDto.phoneNumber,
      dateOfBirth: registerDto.dateOfBirth,
      status: 'Registered', // Initial status for self-registered candidates
      registeredAt: new Date(),
    });

    // Return candidate without password
    const { password, ...candidateWithoutPassword } = candidate.toObject();
    return {
      success: true,
      message: 'Candidate registered successfully',
      data: candidateWithoutPassword,
    };
  }

  /**
   * Get candidate by email (for login purposes)
   */
  async getCandidateByEmail(email: string) {
    return this.candidateModel.findOne({ email: email.toLowerCase() }).exec();
  }

  /**
   * Verify candidate password
   */
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update candidate profile (self-service)
   */
  async updateCandidateProfile(candidateId: string, updateDto: any) {
    // Don't allow updating sensitive fields like password, email, or status through this method
    const { password, email, status, ...safeUpdateData } = updateDto;

    const updated = await this.candidateModel.findByIdAndUpdate(
      candidateId,
      { $set: safeUpdateData },
      { new: true }
    ).exec();

    if (!updated) {
      throw new BadRequestException('Candidate not found');
    }

    const { password: pwd, ...candidateData } = updated.toObject();
    return candidateData;
  }

  /**
   * Change candidate password
   */
  async changePassword(candidateId: string, currentPassword: string, newPassword: string) {
    const candidate = await this.candidateModel.findById(candidateId).exec();
    if (!candidate) {
      throw new BadRequestException('Candidate not found');
    }

    if (!candidate.password) {
      throw new BadRequestException('Candidate password not set');
    }

    // Verify current password
    const isValidPassword = await this.verifyPassword(currentPassword, candidate.password);
    if (!isValidPassword) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.candidateModel.findByIdAndUpdate(
      candidateId,
      { password: hashedPassword },
      { new: true }
    ).exec();

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  /**
   * Get candidate profile
   */
  async getCandidateProfile(candidateId: string) {
    const candidate = await this.candidateModel.findById(candidateId).exec();
    if (!candidate) {
      throw new BadRequestException('Candidate not found');
    }

    const { password, ...candidateData } = candidate.toObject();
    return candidateData;
  }
}
