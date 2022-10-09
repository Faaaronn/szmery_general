import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CompressionService } from 'src/compression/compression.service';
import { ContractsService } from './contracts.service';
import { ContractDto } from './dto/contract.dto';

@Controller('contracts')
export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService,
    private readonly compressionService: CompressionService,
  ) {}

  @Post()
  async issueContracts(
    @Res() res: Response,
    @Body() contractData: ContractDto[],
  ) {
    const contractArray = await this.contractsService.generateContracts(
      contractData,
    );
    const contracts = await this.contractsService.mergeContracts(contractArray);
    res.set({
      // pdf
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=aplugks.pdf`,
      'Content-Length': contracts.length,
      'Access-Control-Expose-Headers': 'Content-Disposition',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(contracts);
  }

  @Post('/zipped')
  async issueZippedContracts(
    @Res() res: Response,
    @Body() contractData: ContractDto[],
  ) {
    const contractArray = await this.contractsService.generateContractsForZip(
      contractData,
    );
    const zippedContracts = await this.compressionService.zipFiles(
      contractArray,
    );
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=aplugks.zip`,
      'Content-Length': zippedContracts.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(zippedContracts);
  }
}