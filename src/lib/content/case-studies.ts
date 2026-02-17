export interface CaseStudy {
	slug: string;
	title: string;
}

export const caseStudies: CaseStudy[] = [
	{ slug: 'boeing', title: 'Boeing' },
	{ slug: 'clovis', title: 'Clovis' },
	{ slug: 'studygenie', title: 'Studygenie' },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
	return caseStudies.find((cs) => cs.slug === slug);
}
