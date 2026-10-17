import type { TestContext } from "node:test";
import assert from "node:assert/strict";
import test from "node:test";
import { tsImport } from "tsx/esm/api";

// src を tsx で読み込む (src は拡張子なしの import を使っているため、node 単体では読み込めない)
const {
  generateTitleDescription,
}: typeof import("../src/generate_title_description.ts") = await tsImport(
  "../src/generate_title_description.ts",
  import.meta.url,
);

// git のref名に使える記号で、PR本文のMarkdownやmermaidを抜けられないこと
const cases: {
  headRef: string;
  // 修正PRのブランチ名 (fix-${headRef}) を表すインラインコード
  headCode: string;
  // 元のブランチ名を表すインラインコード
  headRefCode: string;
  // mermaid上の元のブランチ名
  mermaidHeadRef: string;
}[] = [
  {
    headRef: "feature/test",
    headCode: "`fix-feature/test`",
    headRefCode: "`feature/test`",
    mermaidHeadRef: "feature/test",
  },
  {
    headRef: "feature/日本語",
    headCode: "`fix-feature/日本語`",
    headRefCode: "`feature/日本語`",
    mermaidHeadRef: "feature/日本語",
  },
  {
    headRef: "a`<b>@user</b>`b",
    headCode: "``fix-a`<b>@user</b>`b``",
    headRefCode: "``a`<b>@user</b>`b``",
    mermaidHeadRef: "a__b__user_/b__b",
  },
  {
    headRef: "a``b",
    headCode: "```fix-a``b```",
    headRefCode: "```a``b```",
    mermaidHeadRef: "a__b",
  },
  {
    headRef: "x`",
    headCode: "`` fix-x` ``",
    headRefCode: "`` x` ``",
    mermaidHeadRef: "x_",
  },
  {
    headRef: "@user",
    headCode: "`fix-@user`",
    headRefCode: "`@user`",
    mermaidHeadRef: "_user",
  },
  {
    headRef: "x'}}}%%",
    headCode: "`fix-x'}}}%%`",
    headRefCode: "`x'}}}%%`",
    mermaidHeadRef: "x______",
  },
  {
    headRef: 'x"y',
    headCode: '`fix-x"y`',
    headRefCode: '`x"y`',
    mermaidHeadRef: "x_y",
  },
  {
    headRef: "#1",
    headCode: "`fix-#1`",
    headRefCode: "`#1`",
    mermaidHeadRef: "_1",
  },
];

function setEnv(t: TestContext, env: Record<string, string>) {
  const original: NodeJS.ProcessEnv = { ...process.env };
  t.after(() => {
    for (const key of Object.keys(env)) {
      if (original[key]) {
        process.env[key] = original[key];
      } else {
        delete process.env[key];
      }
    }
  });
  Object.assign(process.env, env);
}

for (const { headRef, headCode, headRefCode, mermaidHeadRef } of cases) {
  test(`escapes ${JSON.stringify(headRef)} in the description`, (t: TestContext) => {
    setEnv(t, {
      HEAD_REF: headRef,
      PR_NUMBER: "1",
      PR_TITLE_PREFIX: "fix",
      PR_DESCRIPTION_PREFIX: "",
      BRANCH_NAME_PREFIX: "fix",
    });
    const mermaidHead: string = `fix-${mermaidHeadRef}`;
    const { title, body } = generateTitleDescription();
    assert.equal(title, "fix #1");
    assert.equal(
      body,
      [
        `本PR ( ${headCode} ) をマージすると差分が次のPRに反映されます。`,
        `* #1 ( ${headRefCode} )`,
        "",
        `CIが再度実行されると本PR ( ${headCode} ) にforce pushされます。`,
        "> [!WARNING]",
        `> 本PR ( ${headCode} ) にコミットを追加すると、CIが再度実行された際にコミットが消える場合があります。`,
        `> コミットを追加したい場合は本PR ( ${headCode} ) を起点に別途PRを立てることをおすすめします。`,
        "```mermaid",
        `%%{init: {'gitGraph': {'mainBranchName': '${mermaidHeadRef}'}}}%%`,
        "gitGraph",
        "  commit",
        "  commit",
        `  branch "${mermaidHead}"`,
        `  checkout "${mermaidHead}"`,
        '  commit id: "fix"',
        `  checkout "${mermaidHeadRef}"`,
        `  merge "${mermaidHead}"`,
        "```",
      ].join("\n"),
    );
  });
}

test("escapes PR_TITLE_PREFIX in the mermaid commit id", (t: TestContext) => {
  setEnv(t, {
    HEAD_REF: "feature",
    PR_NUMBER: "",
    PR_TITLE_PREFIX: 'a"b',
    PR_DESCRIPTION_PREFIX: "",
    BRANCH_NAME_PREFIX: "fix",
  });
  const { title, body } = generateTitleDescription();
  assert.equal(title, 'a"b');
  assert.match(body, /^ {2}commit id: "a_b"$/m);
});
