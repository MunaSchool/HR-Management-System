import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Compensation, CompensationDocument } from './schemas/Compensation.schema';
import { Allowance, AllowanceDocument } from './schemas/allowance.schema';
import { Bonus, BonusDocument } from './schemas/Bonus.schema';
import { Insurance, InsuranceDocument } from './schemas/insurance.schema';
import { PayGrade, PayGradeDocument } from './schemas/paygrade.schema';
import { PayrollPolicy, PayrollPolicyDocument } from './schemas/PayrollPolicy.schema';
import { PayType, PayTypeDocument } from './schemas/paytype.schema';

@Injectable()
export class PayrollConfigurationService {
  constructor(
    @InjectModel(Compensation.name)
    private compensationModel: Model<CompensationDocument>,
    @InjectModel(Allowance.name)
    private allowanceModel: Model<AllowanceDocument>,
    @InjectModel(Bonus.name)
    private bonusModel: Model<BonusDocument>,
    @InjectModel(Insurance.name)
    private insuranceModel: Model<InsuranceDocument>,
    @InjectModel(PayGrade.name)
    private payGradeModel: Model<PayGradeDocument>,
    @InjectModel(PayrollPolicy.name)
    private payrollPolicyModel: Model<PayrollPolicyDocument>,
    @InjectModel(PayType.name)
    private payTypeModel: Model<PayTypeDocument>,
  ) {}

  // Compensation CRUD operations
  async createCompensation(compensationData: Partial<Compensation>): Promise<Compensation> {
    const compensation = new this.compensationModel(compensationData);
    return compensation.save();
  }

  async findAllCompensations(): Promise<Compensation[]> {
    return this.compensationModel.find().exec();
  }

  async findCompensationById(id: string): Promise<Compensation | null> {
    return this.compensationModel.findById(id).exec();
  }

  async updateCompensation(id: string, updateData: Partial<Compensation>): Promise<Compensation | null> {
    return this.compensationModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteCompensation(id: string): Promise<Compensation | null> {
    return this.compensationModel.findByIdAndDelete(id).exec();
  }

  // Allowance CRUD operations
  async createAllowance(allowanceData: Partial<Allowance>): Promise<Allowance> {
    const allowance = new this.allowanceModel(allowanceData);
    return allowance.save();
  }

  async findAllAllowances(): Promise<Allowance[]> {
    return this.allowanceModel.find().exec();
  }

  async findAllowanceById(id: string): Promise<Allowance | null> {
    return this.allowanceModel.findById(id).exec();
  }

  async updateAllowance(id: string, updateData: Partial<Allowance>): Promise<Allowance | null> {
    return this.allowanceModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteAllowance(id: string): Promise<Allowance | null> {
    return this.allowanceModel.findByIdAndDelete(id).exec();
  }

  // Bonus CRUD operations
  async createBonus(bonusData: Partial<Bonus>): Promise<Bonus> {
    const bonus = new this.bonusModel(bonusData);
    return bonus.save();
  }

  async findAllBonuses(): Promise<Bonus[]> {
    return this.bonusModel.find().exec();
  }

  async findBonusById(id: string): Promise<Bonus | null> {
    return this.bonusModel.findById(id).exec();
  }

  async updateBonus(id: string, updateData: Partial<Bonus>): Promise<Bonus | null> {
    return this.bonusModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteBonus(id: string): Promise<Bonus | null> {
    return this.bonusModel.findByIdAndDelete(id).exec();
  }

  // Insurance CRUD operations
  async createInsurance(insuranceData: Partial<Insurance>): Promise<Insurance> {
    const insurance = new this.insuranceModel(insuranceData);
    return insurance.save();
  }

  async findAllInsurances(): Promise<Insurance[]> {
    return this.insuranceModel.find().exec();
  }

  async findInsuranceById(id: string): Promise<Insurance | null> {
    return this.insuranceModel.findById(id).exec();
  }

  async updateInsurance(id: string, updateData: Partial<Insurance>): Promise<Insurance | null> {
    return this.insuranceModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteInsurance(id: string): Promise<Insurance | null> {
    return this.insuranceModel.findByIdAndDelete(id).exec();
  }

  // PayGrade CRUD operations
  async createPayGrade(payGradeData: Partial<PayGrade>): Promise<PayGrade> {
    const payGrade = new this.payGradeModel(payGradeData);
    return payGrade.save();
  }

  async findAllPayGrades(): Promise<PayGrade[]> {
    return this.payGradeModel.find().exec();
  }

  async findPayGradeById(id: string): Promise<PayGrade | null> {
    return this.payGradeModel.findById(id).exec();
  }

  async updatePayGrade(id: string, updateData: Partial<PayGrade>): Promise<PayGrade | null> {
    return this.payGradeModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deletePayGrade(id: string): Promise<PayGrade | null> {
    return this.payGradeModel.findByIdAndDelete(id).exec();
  }

  // PayrollPolicy CRUD operations
  async createPayrollPolicy(policyData: Partial<PayrollPolicy>): Promise<PayrollPolicy> {
    const policy = new this.payrollPolicyModel(policyData);
    return policy.save();
  }

  async findAllPayrollPolicies(): Promise<PayrollPolicy[]> {
    return this.payrollPolicyModel.find().exec();
  }

  async findPayrollPolicyById(id: string): Promise<PayrollPolicy | null> {
    return this.payrollPolicyModel.findById(id).exec();
  }

  async updatePayrollPolicy(id: string, updateData: Partial<PayrollPolicy>): Promise<PayrollPolicy | null> {
    return this.payrollPolicyModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deletePayrollPolicy(id: string): Promise<PayrollPolicy | null> {
    return this.payrollPolicyModel.findByIdAndDelete(id).exec();
  }

  // PayType CRUD operations
  async createPayType(payTypeData: Partial<PayType>): Promise<PayType> {
    const payType = new this.payTypeModel(payTypeData);
    return payType.save();
  }

  async findAllPayTypes(): Promise<PayType[]> {
    return this.payTypeModel.find().exec();
  }

  async findPayTypeById(id: string): Promise<PayType | null> {
    return this.payTypeModel.findById(id).exec();
  }

  async updatePayType(id: string, updateData: Partial<PayType>): Promise<PayType | null> {
    return this.payTypeModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deletePayType(id: string): Promise<PayType | null> {
    return this.payTypeModel.findByIdAndDelete(id).exec();
  }
}

