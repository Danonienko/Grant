export const RankGroups = {
	HICOM: ["1371263000534716528"],
	HR: ["1371247871642566746"],
	MR: ["1371247872321916988"],
	LR: ["1371262999196598363"]
};

export type RankGroups = typeof RankGroups;

export const RankStacks = {
	LRAndHigher: RankGroups.LR.concat(
		RankGroups.MR,
		RankGroups.HR,
		RankGroups.HICOM
	),
	MRAndHigher: RankGroups.MR.concat(RankGroups.HR, RankGroups.HICOM),
	HRAndHigher: RankGroups.HR.concat(RankGroups.HICOM)
} as const;

export type RankStacks = typeof RankStacks;
