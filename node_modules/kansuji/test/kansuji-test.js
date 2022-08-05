"use strict";

var kansuji = require("../kansuji");
var assert = require("power-assert");

describe("kansuji", function () {
  context("with default options", function () {
    it("converts integer into Kansuji", function () {
      assert(kansuji(123) === "百二十三");
      assert(kansuji(12345) === "一万二千三百四十五");
      assert(kansuji(1234567890) === "十二億三千四百五十六万七千八百九十");
      assert(kansuji(0) === "〇");
    });
    it("converts float into Kansuji", function () {
      assert(kansuji(12.34) === "十二・三四");
      assert(kansuji(12345.6789) === "一万二千三百四十五・六七八九");
      assert(kansuji(0.0) === "〇");
    });
    it("converts integer string into Kansuji", function () {
      assert(kansuji("123") === "百二十三");
      assert(kansuji("0123") === "百二十三");
      assert(kansuji(" 123 45 ") === "百二十三");
      assert(kansuji("123ABC") === "百二十三");
      assert(kansuji("0") === "〇");
      assert(kansuji("0000") === "〇");
    });
    it("converts float string into Kansuji", function () {
      assert(kansuji("123.45") === "百二十三・四五");
      assert(kansuji("0123.1230") === "百二十三・一二三");
      assert(kansuji("  123.123  ") === "百二十三・一二三");
      assert(kansuji("123.456.789") === "百二十三・四五六");
      assert(kansuji("0.0") === "〇");
      assert(kansuji("0000.0000") === "〇");
    });
    it("omits ONE before 10, 100 and 1000", function () {
      assert(kansuji(11111) === "一万千百十一");
      assert(kansuji(111111111) === "一億千百十一万千百十一");
    });
    it("converts negative integer into Kansuji", function () {
      assert(kansuji(-123) === "−百二十三");
      assert(kansuji(-12345) === "−一万二千三百四十五");
      assert(kansuji(-1234567890) === "−十二億三千四百五十六万七千八百九十");
    });
    it("converts negative integer string into Kansuji", function () {
      assert(kansuji("-123") === "−百二十三");
      assert(kansuji("-0123") === "−百二十三");
    });
    it("converts positive integer string into Kansuji", function () {
      assert(kansuji("+123") === "＋百二十三");
      assert(kansuji("+0123") === "＋百二十三");
    });
  });
  context("with { unit: false }", function () {
    it("converts integer without units", function () {
      assert(kansuji(1234567890, { unit: false }) === "一二三四五六七八九〇");
      assert(kansuji(1001, { unit: false }) === "一〇〇一");
      assert(kansuji(0, { unit: false }) === "〇");
    });
    it("converts float without units", function () {
      assert(kansuji(1234.5678, { unit: false }) === "一二三四・五六七八");
    });
    it("converts integer string without units", function () {
      assert(kansuji("123", { unit: false }) === "一二三");
      assert(kansuji("0123", { unit: false }) === "〇一二三");
      assert(kansuji("0", { unit: false }) === "〇");
      assert(kansuji("0000", { unit: false }) === "〇〇〇〇");
    });
    it("converts float string without units", function () {
      assert(kansuji("123.45", { unit: false }) === "一二三・四五");
      assert(kansuji("0123.1230", { unit: false }) === "〇一二三・一二三〇");
      assert(kansuji("0000.0000", { unit: false }) === "〇〇〇〇・〇〇〇〇");
    });
  });
  context("with { ichi: true }", function () {
    it("puts ONE before 10, 100 and 1000", function () {
      assert(kansuji(11111, { ichi: true }) === "一万一千一百一十一");
      assert(kansuji(111111111, { ichi: true }) === "一億一千一百一十一万一千一百一十一");
    });
  });
  context("with { ichi: [1000, 100] }", function () {
    it("puts ONE before 10 only", function () {
      assert(kansuji(11111, { ichi: [1000, 100] }) === "一万一千一百十一");
      assert(kansuji(111111111, { ichi: [1000, 100] }) === "一億一千一百十一万一千一百十一");
    });
  });
  context("with { daiji: true }", function () {
    it("converts integer into Daiji", function () {
      assert(kansuji(123, { daiji: true }) === "百弐拾参");
      assert(kansuji(12345, { daiji: true }) === "壱万弐千参百四拾五");
      assert(kansuji(1234567890, { daiji: true }) === "拾弐億参千四百五拾六万七千八百九拾");
    });
    it("converts float into Daiji", function () {
      assert(kansuji(12.34, { daiji: true }) === "拾弐・参四");
      assert(kansuji(12345.6789, { daiji: true }) === "壱万弐千参百四拾五・六七八九");
    });
    it("converts integer string into Daiji", function () {
      assert(kansuji("123", { daiji: true }) === "百弐拾参");
      assert(kansuji("0123", { daiji: true }) === "百弐拾参");
    });
    it("converts float string into Daiji", function () {
      assert(kansuji("123.45", { daiji: true }) === "百弐拾参・四五");
      assert(kansuji("0123.1230", { daiji: true }) === "百弐拾参・壱弐参");
    });
  });
  context("with { daiji: true, unit: false }", function () {
    it("converts integer into Daiji without units", function () {
      assert(kansuji(123, { daiji: true, unit: false }) === "壱弐参");
      assert(kansuji(12345, { daiji: true, unit: false }) === "壱弐参四五");
      assert(kansuji(1234567890, { daiji: true, unit: false }) === "壱弐参四五六七八九〇");
    });
    it("converts float into Daiji", function () {
      assert(kansuji(12.34, { daiji: true, unit: false }) === "壱弐・参四");
      assert(kansuji(12345.6789, { daiji: true, unit: false }) === "壱弐参四五・六七八九");
    });
  });
  context("with { daiji: 'old' }", function () {
    it("converts integer into old Daiji", function () {
      assert(kansuji(123, { daiji: 'old' }) === "佰弐拾参");
      assert(kansuji(12345, { daiji: 'old' }) === "壱萬弐阡参佰肆拾伍");
      assert(kansuji(1234567890, { daiji: 'old' }) === "拾弐億参阡肆佰伍拾陸萬漆阡捌佰玖拾");
    });
    it("converts float into Daiji", function () {
      assert(kansuji(12.34, { daiji: 'old' }) === "拾弐・参肆");
      assert(kansuji(12345.6789, { daiji: 'old' }) === "壱萬弐阡参佰肆拾伍・陸漆捌玖");
    });
    it("converts integer string into Daiji", function () {
      assert(kansuji("123", { daiji: 'old' }) === "佰弐拾参");
      assert(kansuji("0123", { daiji: 'old' }) === "佰弐拾参");
    });
    it("converts float string into Daiji", function () {
      assert(kansuji("123.45", { daiji: 'old' }) === "佰弐拾参・肆伍");
      assert(kansuji("0123.1230", { daiji: 'old' }) === "佰弐拾参・壱弐参");
    });
  });
  context("with { wide: true }", function () {
    it("converts wide-number integer string into Kansuji", function () {
      assert(kansuji("１２３", { wide: true }) === "百二十三");
      assert(kansuji("０１２３", { wide: true }) === "百二十三");
      assert(kansuji("　１２３", { wide: true }) === "百二十三");
      assert(kansuji("１２３ＡＢＣ", { wide: true }) === "百二十三");
      assert(kansuji("０", { wide: true }) === "〇");
      assert(kansuji("０００", { wide: true }) === "〇");
    });
    it("converts wide-number float string into Kansuji", function () {
      assert(kansuji("１２３．４５", { wide: true }) === "百二十三・四五");
      assert(kansuji("０１２３．１２３０", { wide: true }) === "百二十三・一二三");
      assert(kansuji("　１２３．１２３　", { wide: true }) === "百二十三・一二三");
      assert(kansuji("１２３．４５６．７８９", { wide: true }) === "百二十三・四五六");
      assert(kansuji("０．０", { wide: true }) === "〇");
      assert(kansuji("００００．００００", { wide: true }) === "〇");
    });
    it("converts negative wide-number string into Kansuji", function () {
      assert(kansuji("−１２３", { wide: true }) === "−百二十三");
      assert(kansuji("−０１２３", { wide: true }) === "−百二十三");
    });
    it("converts positive wide-number string into Kansuji", function () {
      assert(kansuji("＋１２３", { wide: true }) === "＋百二十三");
      assert(kansuji("＋０１２３", { wide: true }) === "＋百二十三");
    });
  });
  context("given Infinity", function () {
    it("throws TypeError", function () {
      assert.throws(function () { kansuji(Infinity) }, TypeError);
      assert.throws(function () { kansuji(-Infinity) }, TypeError);
    });
  });
  context("given NaN", function () {
    it("throws TypeError", function () {
      assert.throws(function () { kansuji(NaN) }, TypeError);
    });
  });
  context("given non-number string", function () {
    it("throws TypeError", function () {
      assert.throws(function () { kansuji("ABC") }, TypeError);
      assert.throws(function () { kansuji("ABC123") }, TypeError);
      assert.throws(function () { kansuji("１２３") }, TypeError);
      assert.throws(function () { kansuji("") }, TypeError);
    });
  });
});
