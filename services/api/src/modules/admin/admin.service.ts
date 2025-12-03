import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  async getDashboard() {
    return {
      success: true,
      data: {
        newUsers: 45,
        ordersToday: 1250,
        volumeToday: 542000,
        alerts: [],
      },
    };
  }
}
