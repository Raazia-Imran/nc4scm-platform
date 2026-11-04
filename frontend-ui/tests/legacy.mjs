import assert from "node:assert/strict";
export function addLegacyFixtures(fixture) {
  const photo = (id, caption) => ({
    _type: "archivePhoto",
    _key: id,
    asset: { _ref: `image-${id}-800x600-jpg`, _type: "reference" },
    alt: caption,
    caption,
  });
  const about = fixture.docs.find((x) => x._type === "aboutPage");
  about.journey ||= [];
  let milestone = about.journey.find((x) => x.year === "2020");
  if (!milestone) {
    milestone = {
      _key: "test2020",
      year: "2020",
      title: "A milestone in materials research",
      description: "A local fixture for the photographic archive.",
    };
    about.journey.push(milestone);
  }
  milestone.photos = [
    photo("archivefirst", "First approved milestone photograph"),
    photo("archivesecond", "Second approved milestone photograph"),
  ];
  const credit = fixture.docs.find((x) => x._id === "team-digital-fixture");
  credit.contractStatus = "ended";
  credit.keepMainCredit = true;
  fixture.docs.push(
    {
      _id: "legacy-past-fixture",
      _type: "teamMember",
      slug: { current: "past-researcher-fixture" },
      fullName: "Past Researcher Fixture",
      position: "Former Research Assistant",
      group: "research-staff",
      displayPriority: 800,
      contractStatus: "ended",
      cardSummary: "Contributed to materials research.",
      bio: [
        {
          _type: "block",
          _key: "bio",
          children: [
            {
              _type: "span",
              _key: "text",
              text: "The complete original biography remains available.",
              marks: [],
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
      contributionSummary: "Developed the fixture material testing programme.",
    },
    {
      _id: "legacy-hidden-fixture",
      _type: "teamMember",
      fullName: "Hidden Former Member Fixture",
      group: "research-staff",
      contractStatus: "ended",
      hideFromDirectory: true,
      displayPriority: 900,
    },
    {
      _id: "legacy-project-fixture",
      _type: "contributionProject",
      title: "Materials research project fixture",
      slug: { current: "materials-research-fixture" },
      projectType: "student",
      year: 2025,
      summary: "A local fixture for a supervised student project.",
      publicationApproved: true,
      participants: ["Student One", "Student Two"],
      supervisorNames: ["Supervisor Fixture"],
      outcomes: ["A documented material testing method"],
      coverImage: photo("projectcover", "Approved student project photograph"),
      gallery: [photo("projectgallery", "Student project laboratory work")],
    },
    {
      _id: "legacy-unapproved-project",
      _type: "contributionProject",
      title: "Unapproved Project Fixture",
      slug: { current: "unapproved-fixture" },
      publicationApproved: false,
    },
    {
      _id: "legacy-practice-fixture",
      _type: "practicalContributor",
      fullName: "Workshop Contributor Fixture",
      role: "Materials preparation",
      contribution: "Prepared samples for the local test programme.",
      publicationApproved: true,
      skills: ["Sample preparation"],
      gallery: [
        photo("practicephoto", "Approved workshop contribution photograph"),
      ],
    },
    {
      _id: "legacy-unapproved-practice",
      _type: "practicalContributor",
      fullName: "Unapproved Contributor Fixture",
      publicationApproved: false,
    },
  );
}
export async function verifyLegacy(page, base) {
  await page.goto(base + "/about", {waitUntil:"networkidle"});
  assert.equal(
    await page.getByText("Past Researcher Fixture", { exact: true }).count(),
    0,
  );
  assert.ok(
    await page.getByText("Website Maintainer", { exact: true }).isVisible(),
  );
  await page
    .locator(".journey-editorial-card")
    .filter({ hasText: "2020" })
    .click();
  await page.waitForURL("**/events/timeline?year=2020");
  await page
    .getByText("First approved milestone photograph", { exact: true })
    .first()
    .waitFor();
  const stage = page.locator(".timeline-chapter .swipe-stage").first();
  await stage.scrollIntoViewIfNeeded();
  const box = await stage.boundingBox();
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, {
    steps: 12,
  });
  await page.mouse.up();
  await page
    .getByText("Second approved milestone photograph", { exact: true })
    .first()
    .waitFor();
  await stage.focus();
  await page.keyboard.press("ArrowLeft");
  await page
    .getByText("First approved milestone photograph", { exact: true })
    .first()
    .waitFor();
  await page
    .getByRole("button", { name: "Open photograph fullscreen" })
    .click();
  assert.ok(await page.getByRole("dialog").isVisible());
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").isVisible(), false);
  assert.ok(
    await page
      .getByRole("button", { name: "Open photograph fullscreen" })
      .evaluate((el) => el === document.activeElement),
  );
  await page.goto(base + "/legacy", {waitUntil:"networkidle"});
  assert.ok(
    await page
      .getByText("Past Researcher Fixture", { exact: true })
      .isVisible(),
  );
  assert.ok(
    await page.getByText("Website Maintainer", { exact: true }).isVisible(),
  );
  for (const name of [
    "Hidden Former Member Fixture",
    "Unapproved Project Fixture",
    "Unapproved Contributor Fixture",
  ])
    assert.equal(await page.getByText(name, { exact: true }).count(), 0);
  await page
    .locator(".team-profile-card")
    .filter({ hasText: "Past Researcher Fixture" })
    .locator(".team-profile-actions button")
    .click();
  await page
    .getByText("The complete original biography remains available.", {
      exact: true,
    })
    .waitFor();
  assert.ok(
    await page
      .getByText("Developed the fixture material testing programme.", {
        exact: true,
      })
      .isVisible(),
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("link", { name: /Materials research project fixture/ })
    .click();
  await page.getByText("Supervisor Fixture", { exact: true }).waitFor();
  assert.ok(
    await page
      .getByText("A documented material testing method", { exact: true })
      .isVisible(),
  );
  assert.equal(
    (
      await page.request.get(base + "/legacy/projects/unapproved-fixture")
    ).status(),
    404,
  );
  const sitemap = await (await page.request.get(base + "/sitemap.xml")).text();
  assert.ok(sitemap.includes("/legacy/projects/materials-research-fixture"));
  assert.ok(!sitemap.includes("unapproved-fixture"));
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto(base + "/events/timeline?year=2020", {waitUntil:"networkidle"});
  await page.locator(".timeline-chapter .swipe-stage").first().scrollIntoViewIfNeeded();
  const touchBox = await page
    .locator(".timeline-chapter .swipe-stage")
    .first()
    .boundingBox();
  const session = await page.context().newCDPSession(page);
  const x = touchBox.x + touchBox.width * 0.8,
    y = touchBox.y + touchBox.height * 0.5;
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: x - touchBox.width * 0.6, y }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await page
    .getByText("Second approved milestone photograph", { exact: true })
    .first()
    .waitFor();
  await session.detach();
  console.log(
    "PASS: timeline deep links, drag/touch/keyboard gallery, fullscreen focus, automatic archive, lasting credit, complete biography, approval gating and project details.",
  );
}
