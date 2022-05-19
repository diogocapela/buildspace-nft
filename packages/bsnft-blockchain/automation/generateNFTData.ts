import randomWords from "random-words";
import randomColor from "randomcolor";
import { startCase } from "lodash";

function svgToBase64(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function jsonToBase64(svg: string): string {
  return `data:application/json;base64,${btoa(svg)}`;
}

interface InputData {
  text: string;
  textColor: string;
  backgroundColor: string;
}

interface OutputData {
  name: string;
  description: string;
  image: string;
}

function generateSVG({ text, textColor, backgroundColor }: InputData): string {
  let svg =
    '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">';
  svg += `<style>.base { fill: ${textColor}; font-family: serif; font-size: 14px; }</style>`;
  svg += `<rect width="100%" height="100%" fill="${backgroundColor}" />`;
  svg += `<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">${text}</text>`;
  svg += "</svg>";
  return svg;
}

const TOTAL_NFTS = 100;

const inputData: InputData[] = [...Array(TOTAL_NFTS).keys()].map((key) => ({
  text: randomWords(3)
    .map((word) => startCase(word))
    .join(""),
  textColor: randomColor(),
  backgroundColor: randomColor(),
}));

const outputData: OutputData[] = inputData.map((data, index) => ({
  name: data.text,
  description: `The NFT number ${index + 1}.`,
  image: svgToBase64(generateSVG(data)),
}));

console.log(jsonToBase64(JSON.stringify(outputData[1])));

const generatedSVG = generateSVG({
  text: "Hello!",
  textColor: "black",
  backgroundColor: "red",
});

const base64SVG = svgToBase64(generatedSVG);
