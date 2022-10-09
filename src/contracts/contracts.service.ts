import { Injectable } from '@nestjs/common';
import { ContractDto } from './dto/contract.dto';
import puppeteer from 'puppeteer';
import { merge } from 'merge-pdf-buffers';

@Injectable()
export class ContractsService {
  async generateContracts(contractData: ContractDto[]) {
    const contracts = [];
    for (const contract of contractData) {
      const contractHTML = this.getHTMLContent(contract);
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // SEE BELOW WARNING!!!
      });
      const page = await browser.newPage();
      await page.setContent(contractHTML, { waitUntil: 'networkidle2' });
      // await page.emulateMedia('screen');
      const pdf = await page.pdf({
        printBackground: true,
      });

      await browser.close();

      contracts.push(pdf);
    }
    return contracts;
  }

  async generateContractsForZip(contractData: ContractDto[]) {
    const contracts = [];
    for (const contract of contractData) {
      const contractHTML = this.getHTMLContent(contract);
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // SEE BELOW WARNING!!!
      });
      const page = await browser.newPage();
      await page.setContent(contractHTML, { waitUntil: 'networkidle2' });
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

  private getHTMLContent = (contractDetails: ContractDto) => {
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
    <title>Umowa Kupna Sprzedaży</title>
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
                <h5>z adnotacją o dalszej odsprzedaży prowizyjnej</h5>
                <div class="strony">
                    <p>Zawarta ${date
                      .toISOString()
                      .slice(
                        0,
                        10,
                      )}, pomiędzy działalnością gospodarczą <b>APLUG SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ ul. Sejmu Wielkiego 25, 95-060 Brzeziny Nip: 8331404913</b>, zwanym dalej Kupującym,</p>
                    <p>a</p>
                    <p>Panem ${name} <br>zamieszkałym w ${street}, ${city} ${zipCode} ${country} zwanym dalej Sprzedawcą</p>
                    <p>łącznie zwani w dalszej części umowy Stronami, o następującej treści:</p>
                </div>
                <div>
                    <h2>§1</h2>
                    <div>
                        <ol>
                            <li>
                                <div>
                                    <p>Sprzedawca oświadcza, że jest właścicielem ruchomości (Model,Rozmiar,cena)</p>
                                    ${model} ${size} ${price}
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Sprzedawca oświadcza, że towar jest niezniszczony, a jego jakość odpowiada jakości towaru zaprezentowanego Kupującemu na fotografiach, uprzednio przesłanych Kupującemu oraz że towar pozbawiony jest wad fizycznych oraz praw i obciążeń osób trzecich. Sprzedawany towar jest towarem używanym.</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Sprzedawca sprzedaje, a kupujący kupuje towar za cenę określoną w ust. 4.</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p> Kupujący zobowiązuje się do zapłaty na rzecz Sprzedawcy <b>ceny w łącznej kwocie ${price}</b></p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Przeniesienie własności towaru następuje z chwilą jego wydania Kupującemu.</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Kupujący zobowiązuje się do dalszej odsprzedaży ruchomości określonej w ust. 1 w ramach prowadzonej przez niego działalności gospodarczej. Podstawę opodatkowania (kwotę brutto) takiej transakcji stanowić będzie jego prowizja – różnica pomiędzy ceną towaru zapłaconą Sprzedawcy, a ceną jego faktycznej dalszej odsprzedaży.</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                    <h2>§2</h2>
                    <div>
                        <ol>
                            <li>
                                <div>
                                    <p>Zapłata ceny za towar nastąpi w terminie do 7 dni od zawarcia umowy.</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Zapłata ceny nastąpi <b>przelewem</b> chyba, że zostanie między Stronami ustalony inny sposób zapłaty.</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                    <h2>§3</h2>
                    <div>
                        <ol>
                            <li>
                                <div>
                                    <p>Wszelkie zmiany niniejszej umowy wymagają dla swej ważności formy pisemnej.</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>W sprawach nieuregulowanych zastosowanie znajdują przepisy Kodeksu cywilnego.</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze stron.</p>
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
                                Kupujący
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
                        Zgodnie z art. 13 ogólnego rozporządzenia o ochronie danych osobowych z dnia 27 kwietnia 2016 r. (Dz. Urz. UE L 119 z 04.05.2016) (RODO) informuję, iż:
                        - Administratorem Pani/Pana danych osobowych jest firma APLUG SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ NIP: 8331404913; email: aplugspzoo@gmail.com
                        - Podstawę przetwarzania Pani/Pana danych osobowych stanowi umowa sprzedaży oraz prawnie uzasadniony interes Administratora
                        - Pani/Pana dane osobowe przetwarzane będą w celu realizacji praw i obowiązków wynikających z zawartej umowy sprzedaży, zgodnie z art. 6 ust. 1 pkt. b RODO
                        - Pani/Pana dane osobowe przechowywane będą w obowiązującym okresie przechowywania dokumentacji związanej z zasadami archiwizacji zgodnymi z zasadami przechowywania dokumentacji podatkowej Administratora– zgodnie z przepisami rachunkowości.
                        - Administrator. może powierzyć przetwarzanie danych osobowych innym podmiotom.
                        - Posiada Pani/Pan prawo do żądania od administratora dostępu do danych osobowych, ich sprostowania, usunięcia lub ograniczenia przetwarzania z/g z RODO.
                        - Wszelką korespondencję dotyczącą przetwarzania danych osobowych należy kierować na adres siedziby Administratora, ogólnodostępny w rejestrze przedsiębiorców.
                        - Ma Pani/Pan prawo wniesienia skargi do organu nadzorczego (Prezes Urzędu Ochrony Danych Osobowych), gdy uzna, iż przetwarzanie danych osobowych narusza ogólnie obowiązujące przepisy o ochronie danych osobowych.
                    </p>
                </div>
            </div>
        </div>
  </body>
</html>
`;
  };
}
