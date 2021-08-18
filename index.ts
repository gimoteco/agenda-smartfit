import puppeteer, { Page } from "puppeteer";
import userAgents from "user-agents";
import yargs from "yargs";

async function logarNaSmart(pagina: Page, cpf: string, senha: string) {
  await pagina.goto("https://www.smartfit.com.br");

  (await pagina.$x('//a[text()="Agende seu horário"]'))[0]!.click();
  await pagina.waitForNavigation();

  await pagina.type("#fitness_classes_session_login", cpf);
  await pagina.type("#fitness_classes_session_password", senha);
  await pagina.click(".fitness-classes__body-container__form__submit");

  await pagina.waitForSelector(".Message__item");
}

async function marcarHora(pagina: Page, dataHora: string) {
  const elemento = await pagina.$x(
    `//div[contains(text(), "${dataHora}")]/parent::div//parent::div[contains(@class, "smart")]/div/a[contains(@class, "Button")]`
  );
  await elemento[0].click();
  await pagina.waitForNavigation();

  await pagina.screenshot({
    path: "marcado.png",
  });
}

async function main() {
  const args = await yargs.options({
    cpf: { type: "string", demandOption: true },
    senha: { type: "string", demandOption: true },
    horario: { type: "string", demandOption: true },
  }).argv;

  console.log(args);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const pagina = await browser.newPage();
  pagina.setUserAgent(userAgents.toString());

  await logarNaSmart(pagina, args["cpf"], args["senha"]);

  await pagina.screenshot({
    path: "logado.png",
  });

  await marcarHora(pagina, args["horario"]);

  await browser.close();
}

main();
