import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { JSDOM } from 'jsdom';
import jQuery from 'jquery';

// DOM設定（HTML読み込み）
const html = fs.readFileSync('sample.html');
const window = new JSDOM(html).window;
const $ = jQuery(window);
// console.log(window.document.querySelector('html').outerHTML);

// 抽出パターン
const searchPattern = {
  heading: "main h2",
  category: "p",
  number: "code",
  regexp: /[0-9]/
}

// 出力用配列
// let outputFormat = [
//   { heading: "test", category: "カテゴリ", detail: "詳細", no: "No." }
// ];

// CSV入力・変換
const csvData = fs.readFileSync('12CHIBA.CSV');
const csvObj = parse(csvData);

// Table作成
let tableRowTag = "";
tableRowTag += '<table border="1" cellspacing="0" cellpadding="5">\n';

const city = '浦安市';
for (let i = 0; i < csvObj.length; i++) {
  const el = csvObj[i];
  if (el[7] == city) {
    tableRowTag += "<tr>\n";
    el.forEach(element => {
      tableRowTag += "<td>" + element + "</td>\n";
    });
    tableRowTag += "</tr>\n";
  }
}
tableRowTag += "</table>\n";

// HTML出力
$('body').html(tableRowTag);
fs.writeFileSync('output.html', '<!DOCTYPE html>' + window.document.querySelector('html').outerHTML);

// HTMLから対象レコード抽出
let records = [];

$('tr').each(function() {
  let ary = [];

  $(this).find('td').each(function() {
    let str = $(this).text().trim();
    ary.push(str);
  });

  records.push(ary);
});

// CSV変換・出力
const outputStr = stringify(records);
fs.writeFileSync('output.csv', outputStr);
