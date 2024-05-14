const fs = require("fs");
var minify = require("html-minifier").minify;

const inputFilePath = "./html/start.html";
const keywordRegex = /&([^&\s]+)&/g;
const keywordRegexPercent = /%([^%\s]+)%/g;

const baseURL = "https://kielce-adwokat.pl";

function createCanonical(arr) {
  arr.forEach((item) => {
    if (item.outputFileName === "index") {
      item.canonical = `<link rel="canonical" href=${baseURL} />`;
    } else {
      item.canonical = `<link rel="canonical" href=${
        baseURL + "/" + item.outputFileName
      } />`;
    }
  });
}

const data = [
  {
    outputFileName: "index",
    titleTag:
      "Adwokat Kielce - Kancelaria Adwokacka Kielce - Szybko i Skutecznie",
    metaContent:
      "Szukasz adwokata w Kielcach? Zadzwoń do Kancelarii Adwokackiej Bronkowska Chróściel Kobryń. Ponad 300 Pozytywnych Opinii. Proste zasady rozliczeń.",
    body: "&header& <main>&frontpage& &google& &callToAction& &keywords& &faq&</main> &scrollToTop& &footer&",
  },
  {
    outputFileName: "zespol",
    titleTag: "Poznaj naszych doświadczonych adwokatów",
    metaContent:
      "Naszą kancelarię tworzą adwokaci z pasją, doświadczeniem i świeżym spojrzeniem na prawo. Mówimy po ludzku i jesteśmy zawsze perfekcyjnie przygotowani by pomóc",
    body: '&header& <main>&pageTitle.{"title":"Zespół"}& &team& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "karolina-bronkowska",
    titleTag: "Adwokat Karolina Bronkowska - Specjalista",
    metaContent:
      "Adwokat Karolina Bronkowska - licencjonowany pełnomocnik i obrońca z wieloletnim stażem. Przeprowadziła setki spraw sądowych. Chętnie polecana specjalistka",
    body: '&header& <main>&pageTitle.{"title":"Zespół"}& &teamMemberKB& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "piotr-chrosciel",
    titleTag: "Adwokat Piotr Chróściel - Specjalista",
    metaContent:
      "Adwokat Piotr Chróściel - licencjonowany pełnomocnik i obrońca z wieloletnim stażem. Przeprowadził setki spraw sądowych. Chętnie polecany specjalista",
    body: '&header& <main>&pageTitle.{"title":"Zespół"}& &teamMemberPC& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "magdalena-kobryn",
    titleTag: "Adwokat Magdalena Kobryń - Specjalista",
    metaContent:
      "Adwokat Magdalena Kobryń - licencjonowany pełnomocnik i obrońca z wieloletnim stażem. Przeprowadziła setki spraw sądowych. Chętnie polecana specjalistka",
    body: '&header& <main>&pageTitle.{"title":"Zespół"}& &teamMemberMK& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "specjalizacja",
    titleTag: "Specjalizacje naszej kancelarii",
    metaContent:
      "Lista specjalizacji adwokatów z naszej kancelarii. Dowiedz się czym się zajmujemy w naszej pracy. W każdej z tych dziedzin przeprowadziliśmy setki postępowań",
    body: '&header& &pageTitle.{"title":"Specjalizacja"}& <main>&expertise&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "kontakt",
    titleTag: "Kontakt do kancelarii adwokackiej",
    metaContent:
      "Zadzwoń lub napisz, żeby uzyskać bezpośredni kontakt z prawnikiem. Odwiedź naszą siedzibę w centrum Kielc. Zapraszamy na ☕️",
    body: '&header& &pageTitle.{"title":"Kontakt"}& <main>&contact&</main> &scrollToTop& &footer&',
  },
  // articles
  {
    outputFileName: "odszkodowanie-zadoscuczynienie",
    titleTag: "Specjaliści ds. Odszkodowań i Zadośćuczynień",
    metaContent:
      "Nasz doświadczony zespół adwokatów specjalizuje się w różnych roszczeniach odszkodowawczych i zadośćuczynieniach, w tym wypadkach drogowych i błędach medycznych. Zaufaj nam, aby pomóc Ci uzyskać zasłużone odszkodowanie i zadośćuczynienie. Skontaktuj się z nami już dziś.",
    body: '&header& <main>&pageTitle.{"title":"Odszkodowania_i_Zadośćuczynienia"}& &articleOdszkodowaniaZadoscuczynienia& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "sprawy-karne",
    titleTag: "Pomoc Prawna w Sprawach Karnych",
    metaContent:
      "Nasi adwokaci specjalizują się w prawie karnym, reprezentują klientów na różnych etapach procesu, włącznie z apelacjami i zażaleniami. Jesteśmy także pełnomocnikiem dla ofiar przestępstw. Skontaktuj się z nami.",
    body: '&header& <main>&pageTitle.{"title":"Sprawy_karne"}& &articlePrawoKarne& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "prawo-nieruchomosci",
    titleTag: "Prawo Nieruchomości - Pomoc Prawna",
    metaContent:
      "Nasza specjalizacja obejmuje wiele aspektów prawa nieruchomości, w tym zasiedzenie, eksmisję, ochronę własności i wiele innych. Skontaktuj się z nami, aby rozwiązać swoją sprawę nieruchomościową.",
    body: '&header& <main>&pageTitle.{"title":"Prawo_nieruchomości"}& &articlePrawoNieruchomosci& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "umowa-dozywocia",
    titleTag: "Umowa dożywocia | Służebność Dożywocia | Adwokat Kielce",
    metaContent:
      "Umowa dożywocia to sposób dla osób, które mają nieruchomość na zabezpieczenie sobie dożywotniej pomocy w utrzymaniu, w chorobie, aby godnie przeżyć starość.",
    body: '&header& <main>&pageTitle.{"title":"Umowa_dożywocia"}& &articleUmowaDozywocia& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "prawo-pracy",
    titleTag: "Prawo Pracy i Ubezpieczeń Społecznych",
    metaContent:
      "Nasza specjalizacja obejmuje wiele aspektów prawa pracy i ubezpieczeń społecznych, w tym spory pracownika z pracodawcą, rozwiązanie umowy o pracę, wypłatę zaległego wynagrodzenia i wiele innych. Skontaktuj się z nami, aby uzyskać pomoc w swojej sprawie.",
    body: '&header& <main>&pageTitle.{"title":"Prawo_pracy"}& &articlePrawoPracy& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "sprawy-rodzinne",
    titleTag: "Sprawy Rodzinne Adwokat Kielce - Prawo Rodzinne - Alimenty",
    metaContent:
      "Nasza specjalizacja obejmuje różne aspekty prawa rodzinnego, w tym alimenty, kontakty, władzę rodzicielską, ojcostwo, rozdzielność majątkową i wiele innych. Skontaktuj się z nami, aby uzyskać profesjonalną pomoc w swojej sprawie rodzinnej.",
    body: '&header& <main>&pageTitle.{"title":"Sprawy_rodzinne_Adwokat_Kielce_-_Prawo_rodzinne"}& &articlePrawoRodzinne& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "sprawy-spadkowe",
    titleTag: "Pomoc Prawna w Sprawach Spadkowych",
    metaContent:
      "Potrzebujesz pomocy w sprawach spadkowych? Nasza Kancelaria świadczy kompleksowe usługi w dziedzinie prawa spadkowego. Skorzystaj z naszych porad spadkowych i profesjonalnej pomocy. Obsługujemy Klientów w Kielcach i na terenie całego kraju.",
    body: '&header& <main>&pageTitle.{"title":"Sprawy_spadkowe"}& &articlePrawoSpadkowe& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "prawo-zobowiazan",
    titleTag: "Prawo Zobowiązań - Umowy, Doradztwo",
    metaContent:
      "Nasza kancelaria specjalizuje się w Prawie Zobowiązań, umowy, odszkodowania, doradztwo. Pomoc prawnika w Twojej sprawie. Skontaktuj się z nami!",
    body: '&header& <main>&pageTitle.{"title":"Prawo_zobowiązań"}& &articlePrawoZobowiazan& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "rozwod",
    titleTag: "Adwokat Kielce Rozwody - Kancelaria Adwokacka - Rozwód Kielce",
    metaContent:
      "Sprawami rozwodowymi i o podział majątku w Kielcach zajmują się Adwokat Karolina Bronkowska, Adwokat Piotr Chróściel i Adwokat Magdalena Kobryń. Zadzwoń teraz!",
    body: '&header& <main>&pageTitle.{"title":"Adwokat_Kielce_Rozwody_-_Kancelaria_Adwokacka"}& &articleRozwod& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "zasiedzenie-nieruchomosci",
    titleTag: "Zasiedzenie Adwokat Kielce",
    metaContent:
      "Zasiedzenie to nabycie własności przez długotrwałe posiadanie. Dowiedz się, jak działa zasiedzenie nieruchomości. Konsultacje z doświadczonym adwokatem Kielce.",
    body: '&header& <main>&pageTitle.{"title":"Zasiedzenie_Adwokat_Kielce"}& &articleZasiedzenieNieruchomosci& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "opieka-naprzemienna",
    titleTag: "Opieka naprzemienna",
    metaContent: "",
    body: '&header& <main>&pageTitle.{"title":"Opieka_naprzemienna_nad_dzieckiem_–_co_to_takiego_i_w_jakich_sytuacjach_może_być_stosowana?"}& &articleOpiekaNaprzemienna& &google& &callToAction&</main> &scrollToTop& &footer&',
  },
  {
    outputFileName: "polityka-prywatnosci",
    titleTag: "Polityka Prywatności",
    metaContent: "Polityka Prywatności",
    body: '&header& <main>&pageTitle.{"title":"Polityka_prywatności"}& &privacyPolicy&</main> &scrollToTop& &footer&',
  },
];

createCanonical(data);

let preHtmlContent = fs.readFileSync(inputFilePath, "utf8");

function replaceKeywords(content, index) {
  let replacedContent;
  if (content.match(keywordRegexPercent)) {
    replacedContent = content.replaceAll(keywordRegexPercent, (match) => {
      const keyword = match.replaceAll("%", "");
      try {
        const keywordHtmlContent = data[index][keyword];

        if (typeof keywordHtmlContent === "undefined") {
          throw new Error(
            `Keyword "${keyword}" not found. Replace with an empty string.`
          );
        }

        return keywordHtmlContent;
      } catch (err) {
        // console.error(err.message);
        return ""; // Replace with an empty string if the keyword is not found
      }
    });
  }
  return replacedContent;
}

function RGk1iHJ(content, set) {
  let total = "";

  set.forEach((elem) => {
    try {
      const keywordCSSContent = fs.readFileSync(
        `./toInlineCSS/${elem}.css`,
        "utf8"
      );
      if (keywordCSSContent) {
        total = total + keywordCSSContent;
      }
    } catch (err) {
      if (err.code === "ENOENT") {
        // console.error(`Error: File "${elem}.css" not found. Skipping...`);
      } else {
        console.error(err);
      }
    }
  });

  if (total) {
    return total;
  }
}

const CSSkeywords = new Set();

function replaceKeywordsRecursive(content) {
  if (content.match(keywordRegex)) {
    const replacedContent = content.replaceAll(keywordRegex, (match) => {
      const expression = match.replaceAll("&", "");
      let keyword, propsAsString;
      if (expression.includes(".")) {
        const foo = expression.split(".");
        keyword = foo[0];
        propsAsString = foo[1];
      } else {
        keyword = expression;
      }

      try {
        const keywordHtmlContent = fs.readFileSync(
          `./html/${keyword}.html`,
          "utf8"
        );

        CSSkeywords.add(keyword);

        if (propsAsString) {
          const props = JSON.parse(propsAsString);
          let replacedHtmlContent = keywordHtmlContent;
          Object.keys(props).forEach((key) => {
            const placeholder = `*${key}*`;
            const value = props[key];
            // Check if the placeholder exists in the content before attempting to replace it
            // if you need to add whole phrase class=… or style=… you need to escape double quotes in JSON like so "optionalClass":"class=\’”blogPostH1\’”
            if (replacedHtmlContent.includes(placeholder)) {
              replacedHtmlContent = replacedHtmlContent.replaceAll(
                placeholder, // Placeholder to replace
                // underscore is needed otherwise keyword won’t match keywordRegex
                value.replaceAll("_", " ") // Replace with corresponding value
              );
            }
          });
          // Remove any remaining placeholders that don't have corresponding keys in props
          replacedHtmlContent = replacedHtmlContent.replaceAll(
            /\*[^*]+\*/g, // Matches any string enclosed in asterisks
            "" // Replace with an empty string to remove it
          );
          return replacedHtmlContent;
        } else {
          return keywordHtmlContent;
        }
      } catch (err) {
        console.error(err);
        return match; // If the HTML file doesn't exist, leave the placeholder unchanged
      }
    });

    return replaceKeywordsRecursive(replacedContent);
  } else {
    return content;
  }
}

data.map((item, index) => {
  /* .map is called with the following arguments:
  1. current element in the map
  2. index of the current element being processed
  3. the array it was called upon

  więc w tej funkcji robisz tak:
  const arr = ["one", "two", "three"]
  arr.map((item, index) => {
	console.log(`This is the item: ${item}, and this is its ${index}`)
  })
  */
  const htmlContent = replaceKeywords(preHtmlContent, index);
  /* 
    preHtmlContent to jest "./html/start.html" czyli szablon - baza, kazdy plik koncowy się od niego zaczyna, czyli np kontakt.html tez się od niego zaczyna, tylko jest wypełniany inną treścią, w zaleznosci od tego, ktory item w data jest na warsztacie (ktory index aktualnie obrabiamy).
    replaceKeywords szuka w start.html wszystkich keywords, które są owinięte w znak %, np %titleTag%, %body% itd., zamienia np %body% w &header& <main>&pageTitle.{"title":"Adwokat_Kielce_Rozwody_-_Kancelaria_Adwokacka"}& &articleRozwod& &google& &callToAction&</main> &scrollToTop& &footer&'
  */
  let finalHtmlContent = replaceKeywordsRecursive(htmlContent);
  let inlineCSS;
  if (CSSkeywords.size) {
    inlineCSS = `<style>${RGk1iHJ(finalHtmlContent, CSSkeywords)}</style>`;
  }
  finalHtmlContent = finalHtmlContent.replace("£inlineCSS£", inlineCSS || "");
  CSSkeywords.clear();
  const finalHtmlContentMinified = minify(finalHtmlContent, {
    collapseWhitespace: true,
    minifyCSS: true,
  });
  const outputFilePath = `./build/${item.outputFileName}.html`;
  fs.writeFileSync(outputFilePath, finalHtmlContentMinified, "utf8");
});

console.log("File saved successfully!");

// const htmlContent = replaceKeywords(preHtmlContent);

// const finalHtmlContent = replaceKeywordsRecursive(htmlContent);

// const outputFilePath = "./test.html";
// fs.writeFileSync(outputFilePath, finalHtmlContent, "utf8");

/* 
  Get & read start.html 
  Manipulate the start.
    Look for e.g. %title%

*/
