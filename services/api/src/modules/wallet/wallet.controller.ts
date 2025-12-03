import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('wallet')
@Controller('api/wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get wallet summary' })
  async getSummary(@Req() req) {
    return this.walletService.getSummary(req.user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get wallet transaction history' })
  async getHistory(@Req() req) {
    return this.walletService.getHistory(req.user.id);
  }
}
