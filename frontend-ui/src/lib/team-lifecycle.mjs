// A contract end date is inclusive in the centre's local timezone.
export function isPastMember(member, now = Date.now()) {
  if (member.contractStatus === "ended") return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(member.contractEndDate || "")) return false;
  const end = Date.parse(`${member.contractEndDate}T23:59:59.999+05:00`);
  return Number.isFinite(end) && now > end;
}
export function hasLastingCredit(member) {
  return (
    member.keepMainCredit === true || member._id === "team-razia" ||
    member.slug?.current === "raazia-imran-reshamwala"
  );
}
export function directoryMembers(members, scope = "current", now = Date.now()) {
  return members.filter(
    (member) =>
      member.hideFromDirectory !== true &&
      (scope === "past"
        ? isPastMember(member, now)
        : !isPastMember(member, now) || hasLastingCredit(member)),
  );
}
