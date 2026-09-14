import boeingLogo from '$lib/assets/boeing-logo.avif';
import stratusLogo from '$lib/assets/stratus-logo.svg';
import postboxLogo from '$lib/assets/postbox-logo.png';
import asuLogo from '$lib/assets/asu-logo.png';
import watercreditIcon from '$lib/assets/watercredit-icon.svg';
import tapwaterIcon from '$lib/assets/tapwater-icon.png';
import appleIcon from '$lib/assets/apple-download-icon.svg';
import asuzbtIcon from '$lib/assets/asuzbt-icon.png';
import asunewsIcon from '$lib/assets/asunews-icon.png';

export type EntryLink = {
	/** The bare host, kept as the card's second line. */
	label: string;
	href: string;
	/** Card heading. Falls back to the label when a site has no real name. */
	title?: string;
	/** The site's own favicon. Entries without one borrow the org's logo. */
	icon?: string;
};

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
	/** Stands in for a logo when the mark is a glyph rather than artwork. */
	emoji?: string;
	initials: string;
	links?: EntryLink[];
	/** Plural noun for the deck's collapsed face. Defaults to "projects". */
	linkNoun?: string;
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
		logo: stratusLogo,
		initials: 'SV',
		links: [
			{
				label: 'watercreditregistry.org',
				href: 'https://watercreditregistry.org',
				title: 'Water Credit Registry',
				icon: watercreditIcon
			},
			{
				label: 'captivaverde.com/tapwater',
				href: 'https://captivaverde.com/tapwater',
				title: 'Tap Water Database',
				icon: tapwaterIcon
			}
		],
		bullets: [
			'Built and shipped Water Credit Registry. It turns **flow-meter readings into water credits** and tracks every one.',
			'Chose an IO-Link device with the customer and the vendors, Madison Air and ifm. Meter data flows to a Go service on AWS. **Built a simulated meter** to test before the hardware arrived.',
			'Pulled government water and health data out of PDFs, spreadsheets, and old databases. Built an interactive U.S. map by county and ZIP code.'
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
			'Wrote C++ and Node.js software that links factory tools to Boeing systems. Those tools build the **Apache, V-22, Chinook, 787, and Patriot**.',
			'Turned mixed telemetry protocols into clean JSON. Sent commands to each tool and read its results over private networks.',
			'Built recovery for Wi-Fi drops so jobs resume without losing state. Worked across Boeing sites with the engineers, technicians, and mechanics who run the tools.'
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
		logo: postboxLogo,
		initials: 'P',
		links: [
			{
				label: 'postbox.sh/download',
				href: 'https://postbox.sh/download',
				title: 'Download Postbox',
				// It is a macOS download, so the platform mark says more than
				// repeating the app's own icon next to its own entry.
				icon: appleIcon
			}
		],
		bullets: [
			'Designed and shipped a macOS app that posts to several social platforms without opening any of them. **23 users so far**, every one organic.',
			'Built all of it. The Swift app, sign-in, distribution, website, and a Rust server for the platform APIs. Motion, sound, and SVG keep it simple.',
			'Passed API review with the major platforms. Read their policies, worked with reviewers, and changed the product without making it harder to use.'
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
		logo: asuLogo,
		initials: 'ASU',
		bullets: []
	},
	{
		id: 'awards',
		org: 'Awards',
		role: 'Recognition along the way',
		year: '2023',
		dates: '2023',
		emoji: '🏆',
		initials: '★',
		linkNoun: 'awards',
		links: [
			{ label: 'asuzbt.org', href: 'https://asuzbt.org', title: 'ZBT at ASU', icon: asuzbtIcon },
			{
				label: 'news.engineering.asu.edu',
				href: 'https://news.engineering.asu.edu/2023/03/student-entrepreneurs-pitch-innovative-ideas/',
				title: 'Student entrepreneurs pitch innovative ideas',
				icon: asunewsIcon
			}
		],
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
