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
      'Content-Disposition': `attachment; filename=${contractArray[0].uid}.pdf`,
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
    res.send({
      message:
        'Rozpoczynam generację pdfa. W ciągu kilku minut powinieneś otrzymać go na maila.',
    });
    const contractArray = await this.contractsService.generateContractsForZip(
      contractData,
    );
    const zippedContracts = await this.compressionService.zipFiles(
      contractArray,
    );
    const emailResult = await this.mailerService.sendMessageToAplug(
      'APLUG-umowy-ks.zip',
      zippedContracts,
    );

    console.error(emailResult);
    if (emailResult === undefined) return;
    await this.mailerService.sendDebugMessage(
      'zip',
      JSON.stringify(emailResult),
    );
  }

  @Post('/generate')
  async mergePDFs(@Res() res: Response, @Body() contractData: ContractDto[]) {
    res.send({
      message:
        'Rozpoczynam generację pdfa. W ciągu kilku minut powinieneś otrzymać go na maila.',
    });
    const contractArray = await this.contractsService.generateContracts(
      contractData,
    );
    const contracts = await this.contractsService.mergeContracts(contractArray);

    const emailResult = await this.mailerService.sendMessageToAplug(
      'APLUG-umowy-ks.pdf',
      contracts,
    );
    console.error(emailResult);
    if (emailResult === undefined) return;
    await this.mailerService.sendDebugMessage(
      'merge',
      JSON.stringify(emailResult),
    );
  }

  @Post('/issue-and-send/:email')
  async issueAndSend(
    @Res() res: Response,
    @Param() email: any,
    @Body() contractData: ContractDto[],
  ) {
    res.send({
      message:
        'Rozpoczynam generację pdfa. W ciągu kilku minut powinieneś otrzymać go na maila.',
    });
    const contractArray = await this.contractsService.generateContracts(
      contractData,
    );
    const contracts = await this.contractsService.mergeContracts(contractArray);

    const emailResult = await this.mailerService.sendMessage(
      email.email,
      'APLUG-umowy-ks.pdf',
      contracts,
    );
    console.error(emailResult);
    if (emailResult === undefined) return;
    await this.mailerService.sendDebugMessage(
      'merge',
      JSON.stringify(emailResult),
    );
  }
}
