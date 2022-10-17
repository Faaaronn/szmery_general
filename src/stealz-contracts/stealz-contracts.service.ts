import { Injectable } from '@nestjs/common';
import { StealzContractDto } from './dto/stealz-contract.dto';
import puppeteer from 'puppeteer';
import { merge } from 'merge-pdf-buffers';

@Injectable()
export class StealzContractsService {
  // async generateContracts(contractData: StealzContractDto[]) {
  //   const contracts = [];
  //   const browser = await puppeteer.launch({
  //     args: ['--no-sandbox', '--disable-setuid-sandbox'], // SEE BELOW WARNING!!!
  //     // headless: true,
  //   });
  //   const page = await browser.newPage();
  //   for (const contract of contractData) {
  //     await page.setContent(contractHTML, { waitUntil: 'domcontentloaded' });
  //     const pdf = await page.pdf();
  //     const contractHTML = this.getHTMLContent(contract);
  //     contracts.push(pdf);
  //   }
  //   await browser.close();
  //   return contracts;
  // }

  // async generateContractsForZip(contractData: StealzContractDto[]) {
  //   const contracts = [];
  //   for (const contract of contractData) {
  //     const contractHTML = this.getHTMLContent(contract);
  //     const browser = await puppeteer.launch({
  //       args: ['--no-sandbox', '--disable-setuid-sandbox'], // SEE BELOW WARNING!!!
  //     });
  //     const page = await browser.newPage();
  //     await page.setContent(contractHTML, { waitUntil: 'domcontentloaded' });
  //     // await page.emulateMedia('screen');
  //     const pdf = await page.pdf({
  //       printBackground: true,
  //     });

  //     await browser.close();

  //     contracts.push({ content: pdf, name: `${contract.uid}.pdf` });
  //   }
  //   return contracts;
  // }

  async generateContractsForEmail(contractData: StealzContractDto[]) {
    const contracts = [];
    for (const contract of contractData) {
      const contractHTML = this.getHTMLContent(contract);
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // SEE BELOW WARNING!!!
      });
      const page = await browser.newPage();
      await page.setContent(contractHTML, { waitUntil: 'domcontentloaded' });

      const pdf = await page.pdf({
        printBackground: true,
      });

      await browser.close();
      contracts.push({ content: pdf, filename: `${contract.uid}.pdf` });
    }
    return contracts;
  }

  async mergeContracts(contractArray: Buffer[]) {
    const contracts = await merge(contractArray);
    return contracts;
  }

  private getHTMLContent = (contractDetails: StealzContractDto) => {
    const { date, name, address, uid, signature, price } = contractDetails;

    return `
     <!DOCTYPE html>
      <html lang="pl">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>Umowa Sneakers Stealz</title>
          <style>
            *,
            **, body{
              margin: 0;
              padding:0;
              line-height:1.3rem;
            }
            body {
              margin:0px!important;
              font-size:17px;
              padding-left:5%;
              padding-right:5%;
            }
            main {
              height:100vh;       
              box-sizing:border-box;
              margin:0;
              padding:0;
              display:flex;
              flex-direction:column;
              align-items:center;
              justify-content:space-between;
              padding-top:10vh;
              padding-bottom:15vh;
            }
            .nr-umowy {
              position: absolute;
              top: 10px;
              right: 20px;
            }
            h1 {
              text-align: center;
              text-transform: uppercase;
              padding-bottom:2rem;
            }
            .dane-firmowe {
              padding-left: 3%;
              padding-right: 3%;
            }
            .podpisy {
              display: grid;
              grid-template-columns: 1fr 1fr;
              text-align:center;
              font-weight:600;
            }
          </style>
        </head>
        <body>
          <main>
            <span class="nr-umowy">UMOWA NR: ${uid}</span>
            <section>
          <div>
              <h1>Potwierdzenie sprzedaży (Sales Confirmation)</h1>
            </div>
            <div>
              <p>
                Ja, niżej podpisany/a ${name} zamieszkały w ${address}
                oświadczam, że:
              </p>
              <div>
                W dniu ${date} sprzedałem/am
                <b
                  >buty sportowe kolekcjonersie, z drugiej ręki, noszone przynajmniej
                  raz</b
                >
                firmie:<br />
                <p class="dane-firmowe">
                  Snekers Stealz Karol Dolata z siedzibą w Boleścin 49N, 58-100
                  Świdnica, nr NIP: 8842812139
                </p>
              </div>
              <div>
                Cena, którą mi zapłacono za wyżej wymieniony produkt to ${price}.
              </div>
            </section>
            <section>          
                <div class="podpisy">
                    <div>Podpis kupującego:</div>
                    <div>Podpis sprzedawcy:</div>
                    <img width="300px" height="150px" src="data:image/png;base64,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" />
                    <img width="300px" height="150px" src="${signature}" />
                  </div>
              </section>
            </div>
          </main>
        </body>
      </html>`;
  };
}
