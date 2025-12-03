import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audit } from './entities/audit.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private auditRepository: Repository<Audit>,
  ) {}

  async getAudits() {
    const audits = await this.auditRepository.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });

    return {
      success: true,
      data: audits,
    };
  }
}
