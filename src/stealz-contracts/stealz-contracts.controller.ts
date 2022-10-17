import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CompressionService } from 'src/compression/compression.service';
import { StealzMailerService } from 'src/stealz-mailer/stealz-mailer.service';
import { StealzContractsService } from './stealz-contracts.service';
import { StealzContractDto } from './dto/stealz-contract.dto';

@Controller('contracts')
export class StealzContractsController {
  constructor(
    private readonly contractsService: StealzContractsService,
    private readonly compressionService: CompressionService,
    private readonly mailerService: StealzMailerService,
  ) {}

  // @Post()
  // async issueContracts(
  //   @Res() res: Response,
  //   @Body() contractData: StealzContractDto[],
  // ) {
  //   const contractArray = await this.contractsService.generateContracts(
  //     contractData,
  //   );
  //   const contracts = await this.contractsService.mergeContracts(contractArray);
  //   res.set({
  //     // pdf
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': `attachment; filename=${contractData[0].uid}.pdf`,
  //     'Content-Length': contracts.length,
  //     'Access-Control-Expose-Headers': 'Content-Disposition',
  //     'Cache-Control': 'no-cache, no-store, must-revalidate',
  //     Pragma: 'no-cache',
  //     Expires: 0,
  //   });

  //   res.end(contracts);
  // }

  // @Post('/zipped')
  // async issueZippedContracts(
  //   @Res() res: Response,
  //   @Body() contractData: StealzContractDto[],
  // ) {
  //   res.send({
  //     message:
  //       'Rozpoczynam generację pdfa. W ciągu kilku minut powinieneś otrzymać go na maila.',
  //   });
  //   const contractArray = await this.contractsService.generateContractsForZip(
  //     contractData,
  //   );
  //   const zippedContracts = await this.compressionService.zipFiles(
  //     contractArray,
  //   );
  //   const emailResult = await this.mailerService.sendMessageToStealz(
  //     'Sneakers-Stealz-umowy-ks.zip',
  //     zippedContracts,
  //   );

  //   console.error(emailResult);
  //   if (emailResult === undefined) return;
  //   await this.mailerService.sendDebugMessageStealz(
  //     'zip',
  //     JSON.stringify(emailResult),
  //   );
  // }

  // @Post('/generate')
  // async mergePDFs(
  //   @Res() res: Response,
  //   @Body() contractData: StealzContractDto[],
  // ) {
  //   res.send({
  //     message:
  //       'Rozpoczynam generację pdfa. W ciągu kilku minut powinieneś otrzymać go na maila.',
  //   });
  //   const contractArray = await this.contractsService.generateContracts(
  //     contractData,
  //   );
  //   const contracts = await this.contractsService.mergeContracts(contractArray);

  //   const emailResult = await this.mailerService.sendMessageToStealz(
  //     'Sneakers-Stealz-umowy-ks.pdf',
  //     contracts,
  //   );
  //   console.error(emailResult);
  //   if (emailResult === undefined) return;
  //   await this.mailerService.sendDebugMessageStealz(
  //     'merge',
  //     JSON.stringify(emailResult),
  //   );
  // }
  @Post('/issue-and-send/:email')
  async issueAndSend(
    @Res() res: Response,
    @Param() email: any,
    @Body() contractData: StealzContractDto[],
  ) {
    res.send({
      message:
        'Rozpoczynam generację pdfa. Niedługo powinieneś/aś otrzymać go na maila.',
    });

    const contractArray = await this.contractsService.generateContractsForEmail(
      contractData,
    );
    const emailResult = await this.mailerService.sendMessageStealz(
      email.email,
      contractArray,
    );
    if (emailResult === undefined) return;
    await this.mailerService.sendDebugMessageStealz(
      'merge',
      JSON.stringify(emailResult),
    );
  }
}
