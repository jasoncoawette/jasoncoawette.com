import boeingLogo from '$lib/assets/boeing-logo.avif';

export type EntryLink = { label: string; href: string };

export type Entry = {
	id: string;
	org: string;
	/** Optional link on the organisation name itself. */
	href?: string;
	role: string;
	/** Gutter: month above, year below. Omitted month collapses to year only. */
	month?: string;
	year: string;
	/** Spoken/narrow-screen form of the same thing. */
	dates: string;
	badge?: string;
	logo?: string;
	initials: string;
	links?: EntryLink[];
	/** `**…**` marks emphasis, mirroring the bold runs in the CV. */
	bullets: string[];
};

export const entries: Entry[] = [
	{
		id: 'stratus',
		org: 'Stratus Ventures',
		href: 'https://stratus.engineer',
		role: 'Founder and Independent Software Contractor',
		month: 'Aug',
		year: '2026',
		dates: 'Aug 2026 – Present',
		badge: 'Now',
		initials: 'SV',
		links: [
			{ label: 'stratus.engineer', href: 'https://stratus.engineer' },
			{ label: 'watercreditregistry.org', href: 'https://watercreditregistry.org' },
			{ label: 'captivaverde.com/tapwater', href: 'https://captivaverde.com/tapwater' }
		],
		bullets: [
			'Built and deployed Water Credit Registry, which turns **physical flow-meter readings into water credits** and tracks each credit.',
			'Worked with the customer and engineers at hardware vendors Madison Air and ifm to choose an IO-Link device and send meter data to a Go service on AWS. **Built a simulated meter** to test before the equipment arrived.',
			'Combined government water and health data from PDFs, spreadsheets, and old databases, then built an interactive U.S. map by county and ZIP code.'
		]
	},
	{
		id: 'boeing',
		org: 'Boeing',
		href: 'https://boeing.com',
		role: 'Software Engineer',
		month: 'Jan',
		year: '2026',
		dates: 'Jan 2026 – Aug 2026',
		logo: boeingLogo,
		initials: 'B',
		bullets: [
			'Built C++ and Node.js software that connected factory tools to Boeing systems used in **Apache, V-22, Chinook, 787, and Patriot** production.',
			'Handled different telemetry protocols, organized the data into structured JSON, and sent commands to tools while receiving their readings over private networks.',
			'Built recovery for Wi-Fi drops so factory jobs could resume without losing state. Worked across Boeing sites with engineers, technicians, mechanics, and equipment users to understand each tool and fix problems.'
		]
	},
	{
		id: 'postbox',
		org: 'Postbox',
		href: 'https://postbox.sh',
		role: 'Founder, Designer and Engineer',
		month: 'Aug',
		year: '2026',
		dates: 'Aug 2026 – Present',
		badge: 'Now',
		initials: 'P',
		links: [{ label: 'postbox.sh', href: 'https://postbox.sh' }],
		bullets: [
			'Designed and shipped a macOS app for publishing to several social platforms without opening social media; grew it to **23 users organically**.',
			'Built the Swift app, sign-in, distribution, website, and a Rust web server that handles the platform APIs. Used motion, sound, and SVG interactions to keep the experience simple.',
			'Navigated API review with major social platforms by reading their policies, working with reviewers, and adapting the product without making it harder to use.'
		]
	},
	{
		id: 'asu',
		org: 'Arizona State University',
		href: 'https://asu.edu',
		role: 'Bachelor of Science in Computer Science',
		month: 'Dec',
		year: '2025',
		dates: 'Dec 2025',
		initials: 'ASU',
		bullets: []
	},
	{
		id: 'awards',
		org: 'Awards',
		role: 'Recognition along the way',
		year: '2023',
		dates: '2023',
		initials: '★',
		links: [{ label: 'asuzbt.org', href: 'https://asuzbt.org' }],
		bullets: [
			'**Top 4, ASU Venture Devils.**',
			'**Tech Devils invitee**, featured by ASU in 2023.',
			'**National ZBT Chapter Best Website.**'
		]
	}
];

/** Splits `**bold**` runs into renderable segments, so no `{@html}` is needed. */
export function segments(text: string): { text: string; strong: boolean }[] {
	return text
		.split('**')
		.map((part, i) => ({ text: part, strong: i % 2 === 1 }))
		.filter((part) => part.text.length > 0);
}
