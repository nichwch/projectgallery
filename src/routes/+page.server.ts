import { PROJECT_FILE } from '../lib';
import type { PageServerLoad } from './$types';
import * as fs from 'fs/promises';

export const load = (async () => {
	const projectsRaw = await fs.readFile(PROJECT_FILE, 'utf-8');
	const projects = JSON.parse(projectsRaw);
	return { projects };
}) satisfies PageServerLoad;
