import { Injectable } from '@nestjs/common';
import { AplugContractDto } from './dto/aplug-contract.dto';
import puppeteer from 'puppeteer';
import { merge } from 'merge-pdf-buffers';

@Injectable()
export class AplugContractsService {
  // export class ContractsService implements OnApplicationBootstrap {
  // onApplicationBootstrap = async () => {
  //   await this.runBrowser();
  // };
  // private browser: puppeteer.Browser;
  // private page: puppeteer.Page;

  // async runBrowser() {
  //   const browser = await puppeteer.launch({
  //     args: ['--no-sandbox', '--disable-setuid-sandbox'], // SEE BELOW WARNING!!!
  //     headless: true,
  //   });
  //   const page = await browser.newPage();
  //   this.browser = browser;
  //   this.page = page;
  //   return page;
  // }

  async generateContracts(contractData: AplugContractDto[]) {
    const contracts = [];
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // SEE BELOW WARNING!!!
      // headless: true,
    });
    const page = await browser.newPage();
    for (const contract of contractData) {
      const contractHTML = this.getHTMLContent(contract);
      await page.setContent(contractHTML, { waitUntil: 'domcontentloaded' });
      const pdf = await page.pdf();
      contracts.push(pdf);
    }
    await browser.close();
    return contracts;
  }

  async generateContractsForZip(contractData: AplugContractDto[]) {
    const contracts = [];
    for (const contract of contractData) {
      const contractHTML = this.getHTMLContent(contract);
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // SEE BELOW WARNING!!!
      });
      const page = await browser.newPage();
      await page.setContent(contractHTML, { waitUntil: 'domcontentloaded' });
      // await page.emulateMedia('screen');
      const pdf = await page.pdf({
        printBackground: true,
      });

      await browser.close();

      contracts.push({ content: pdf, name: `${contract.uid}.pdf` });
    }
    return contracts;
  }

  async mergeContracts(contractArray: Buffer[]) {
    const contracts = await merge(contractArray);
    return contracts;
  }

  private getHTMLContent = (contractDetails: AplugContractDto) => {
    const {
      date,
      name,
      street,
      city,
      zipCode,
      country,
      uid,
      signature,
      model,
      size,
      price,
    } = contractDetails;
    return `
     <html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Umowa Kupna Sprzeda??y</title>
    <style>
      *,
      * * {
        font-family: firefly, DejaVu Sans, sans-serif;
      }
      body {
        margin-left: 50%;
        transform: translateX(-50%);
        width: 90%;
        font-size: 12.5px;
        
      }
      h1 {
        font-size: 1.3em;
        margin:5px;
      }
      h1,
      h2,
      h3 {
        text-align: center;
        font-weight: 900;
        font-family: firefly, DejaVu Sans, sans-serif;
      }
      h5 {
        text-align: center;
        margin:5px;
      }
      h6 {
        text-align:center;
        font-size:1.1rem;
        margin:10px;
      }
      p {
        margin-top:10px;
        margin-bottom:10px;
      }
      h2 {
        font-size: 1.1em;
        margin: 0;
        padding: 0;
      }
      .podpisy span {
        display: flex !important;
        flex-direction: row;
        justify-content: space-between;
      }
      .strony {
        padding-left: 10%;
        padding-right: 10%;
      }
      th {
        font-weight: normal !important;
      }
      .signatures {
        display: flex !important;
        flex-direction: row;
        justify-content: space-around !important;
      }
      li:before {
        font-size: 1em;
      }
      li {
        margin: 0px;
      }
      .wrapper {
        min-height: 100vh;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .podpisy {
        display: flex;
        flex-direction:column;
        align-items: center;
        justify-content: center;
      }
      .podpisy > div {
        display:flex;width:80%;
        justify-content:space-between;
      }
      .podpisy h6, .podpisy img {
        width: 200px;
      }
    </style>
  </head>

  <body style="position: relative">
    <div style="position:absolute;top:20px;right:20px;font-size:1.1rem;">${uid}</div>
        <div style="min-height:95vh;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:space-between;">
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:space-between;">
                <h1>UMOWA KUPNA SPRZEDAZY</h1>
                <h5>z adnotacj?? o dalszej odsprzeda??y prowizyjnej</h5>
                <div class="strony">
                    <p>Zawarta ${new Date(date)
                      .toISOString()
                      .slice(
                        0,
                        10,
                      )}, pomi??dzy dzia??alno??ci?? gospodarcz?? <b>APLUG SP????KA Z OGRANICZON?? ODPOWIEDZIALNO??CI?? ul. Sejmu Wielkiego 25, 95-060 Brzeziny Nip: 8331404913</b>, zwanym dalej Kupuj??cym,</p>
                    <p>a</p>
                    <p>Panem ${name} <br>zamieszka??ym w ${street}, ${city} ${zipCode} ${country} zwanym dalej Sprzedawc??</p>
                    <p>????cznie zwani w dalszej cz????ci umowy Stronami, o nast??puj??cej tre??ci:</p>
                </div>
                <div>
                    <h2>??1</h2>
                    <div>
                        <ol>
                            <li>
                                <div>
                                    <p>Sprzedawca o??wiadcza, ??e jest w??a??cicielem ruchomo??ci (Model,Rozmiar,cena)</p>
                                    ${model} ${size} ${price}
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Sprzedawca o??wiadcza, ??e towar jest niezniszczony, a jego jako???? odpowiada jako??ci towaru zaprezentowanego Kupuj??cemu na fotografiach, uprzednio przes??anych Kupuj??cemu oraz ??e towar pozbawiony jest wad fizycznych oraz praw i obci????e?? os??b trzecich. Sprzedawany towar jest towarem u??ywanym.</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Sprzedawca sprzedaje, a kupuj??cy kupuje towar za cen?? okre??lon?? w ust. 4.</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p> Kupuj??cy zobowi??zuje si?? do zap??aty na rzecz Sprzedawcy <b>ceny w ????cznej kwocie ${price}</b></p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Przeniesienie w??asno??ci towaru nast??puje z chwil?? jego wydania Kupuj??cemu.</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Kupuj??cy zobowi??zuje si?? do dalszej odsprzeda??y ruchomo??ci okre??lonej w ust. 1 w ramach prowadzonej przez niego dzia??alno??ci gospodarczej. Podstaw?? opodatkowania (kwot?? brutto) takiej transakcji stanowi?? b??dzie jego prowizja ??? r????nica pomi??dzy cen?? towaru zap??acon?? Sprzedawcy, a cen?? jego faktycznej dalszej odsprzeda??y.</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                    <h2>??2</h2>
                    <div>
                        <ol>
                            <li>
                                <div>
                                    <p>Zap??ata ceny za towar nast??pi w terminie do 7 dni od zawarcia umowy.</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Zap??ata ceny nast??pi <b>przelewem</b> chyba, ??e zostanie mi??dzy Stronami ustalony inny spos??b zap??aty.</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                    <h2>??3</h2>
                    <div>
                        <ol>
                            <li>
                                <div>
                                    <p>Wszelkie zmiany niniejszej umowy wymagaj?? dla swej wa??no??ci formy pisemnej.</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>W sprawach nieuregulowanych zastosowanie znajduj?? przepisy Kodeksu cywilnego.</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Umow?? sporz??dzono w dw??ch jednobrzmi??cych egzemplarzach, po jednym dla ka??dej ze stron.</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                    <div>
                    <div class="podpisy">
                        <h3>Podpisy:</h3>
                        <div class="">
                            <h6>Sprzedawca</h6>
                            <h6>
                                Kupuj??cy
                            </h6>
                        </div>
                        <div class="">
                            <img src='${signature}' width="200px" height="auto">
                            <h6 >MALINOWSKI</h6>
                        </div>
                    </div>
                </div>
                </div>
            </div>
                <div style="font-size:0.65em;margin-top:-15px!important;">
                    <h3>Klauzula informacyjna RODO do umowy kupna sprzedazy</h3>
                    <p>
                        Zgodnie z art. 13 og??lnego rozporz??dzenia o ochronie danych osobowych z dnia 27 kwietnia 2016 r. (Dz. Urz. UE L 119 z 04.05.2016) (RODO) informuj??, i??:
                        - Administratorem Pani/Pana danych osobowych jest firma APLUG SP????KA Z OGRANICZON?? ODPOWIEDZIALNO??CI?? NIP: 8331404913; email: aplugspzoo@gmail.com
                        - Podstaw?? przetwarzania Pani/Pana danych osobowych stanowi umowa sprzeda??y oraz prawnie uzasadniony interes Administratora
                        - Pani/Pana dane osobowe przetwarzane b??d?? w celu realizacji praw i obowi??zk??w wynikaj??cych z zawartej umowy sprzeda??y, zgodnie z art. 6 ust. 1 pkt. b RODO
                        - Pani/Pana dane osobowe przechowywane b??d?? w obowi??zuj??cym okresie przechowywania dokumentacji zwi??zanej z zasadami archiwizacji zgodnymi z zasadami przechowywania dokumentacji podatkowej Administratora??? zgodnie z przepisami rachunkowo??ci.
                        - Administrator. mo??e powierzy?? przetwarzanie danych osobowych innym podmiotom.
                        - Posiada Pani/Pan prawo do ????dania od administratora dost??pu do danych osobowych, ich sprostowania, usuni??cia lub ograniczenia przetwarzania z/g z RODO.
                        - Wszelk?? korespondencj?? dotycz??c?? przetwarzania danych osobowych nale??y kierowa?? na adres siedziby Administratora, og??lnodost??pny w rejestrze przedsi??biorc??w.
                        - Ma Pani/Pan prawo wniesienia skargi do organu nadzorczego (Prezes Urz??du Ochrony Danych Osobowych), gdy uzna, i?? przetwarzanie danych osobowych narusza og??lnie obowi??zuj??ce przepisy o ochronie danych osobowych.
                    </p>
                </div>
            </div>
        </div>
  </body>
</html>
`;
  };
}
