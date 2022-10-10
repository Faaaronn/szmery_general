import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CompressionService } from 'src/compression/compression.service';
import { MailerService } from 'src/mailer/mailer.service';
import { ContractsService } from './contracts.service';
import { ContractDto } from './dto/contract.dto';

@Controller('contracts')
export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService,
    private readonly compressionService: CompressionService,
    private readonly mailerService: MailerService,
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

  @Post('/merge')
  async mergePDFs(@Res() res: Response, @Body() contractData: any) {
    const contracts = await this.contractsService.mergeContracts(contractData);
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
  @Post('/zip')
  async zipPDFs(@Res() res: Response, @Body() contractData: any) {
    const zippedContracts = await this.compressionService.zipFiles(
      contractData,
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

  @Post('/issue-and-send/:email')
  async issueAndSend(
    @Res() res: Response,
    @Param() email: string,
    @Body() contractData: ContractDto[],
  ) {
    res.send({ message: 'Proces rozpoczęty' });
    const contractArray = await this.contractsService.generateContracts(
      contractData,
    );
    const contracts = await this.contractsService.mergeContracts(contractArray);

    await this.mailerService.sendMessage(
      email,
      'APLUG-umowy-ks.pdf',
      contracts,
    );
  }
}
