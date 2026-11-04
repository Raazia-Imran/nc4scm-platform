import test from "node:test";
import assert from "node:assert/strict";
import { isPastMember, directoryMembers } from "../src/lib/team-lifecycle.mjs";
test("contract date is inclusive in Pakistan time, including the final millisecond", () => {
  const member = { contractEndDate: "2030-04-08" };
  assert.equal(
    isPastMember(member, Date.parse("2030-04-08T23:59:59.999+05:00")),
    false,
  );
  assert.equal(
    isPastMember(member, Date.parse("2030-04-09T00:00:00+05:00")),
    true,
  );
});
test("an ended contract immediately moves a complete profile and keeps lasting credit", () => {
  const active = { _id: "active", bio: [{ text: "Unchanged biography" }] };
  const ended = {
    _id: "ended",
    contractStatus: "ended",
    email: "public@example.com",
    bio: [{ text: "Complete biography" }],
  };
  const credited = {
    _id: "credit",
    contractStatus: "ended",
    keepMainCredit: true,
  };
  const raazia = {
    _id: "raazia",
    contractStatus: "ended",
    slug: { current: "raazia-imran-reshamwala" },
  };
  const hidden = {
    _id: "hidden",
    contractStatus: "ended",
    keepMainCredit: true,
    hideFromDirectory: true,
  };
  const members = [active, ended, credited, raazia, hidden];
  assert.deepEqual(
    directoryMembers(members, "current").map((x) => x._id),
    ["active", "credit", "raazia"],
  );
  assert.deepEqual(
    directoryMembers(members, "past").map((x) => x._id),
    ["ended", "credit", "raazia"],
  );
  assert.equal(directoryMembers(members, "past")[0], ended);
  assert.deepEqual(ended.bio, [{ text: "Complete biography" }]);
});
test("existing profiles without new fields remain current and malformed dates do not archive them", () => {
  assert.equal(isPastMember({}), false);
  assert.equal(isPastMember({ contractEndDate: "not-a-date" }), false);
  assert.equal(
    isPastMember({ contractStatus: "ended", contractEndDate: "2099-01-01" }),
    true,
  );
});
