import { rules, PLANTS, PLANT_LABELS, type Fakta, type Rule, type Plant } from './rules';

export interface HasilInference {
	ranked: {
		plant: Plant;
		label: string;
		image: string;
		score: number;
		level: string;
		contributors: Rule[];
	}[];
	firedRules: Rule[];
	scores: Record<Plant, number>;
}

export function infer(fakta: Fakta): HasilInference {
	// 1. Inisialisasi skor semua tanaman = 0
	const scores = Object.fromEntries(PLANTS.map((p) => [p, 0])) as Record<Plant, number>;
	const firedRules: Rule[] = [];

	// 2. Evaluasi semua rules
	rules.forEach((rule) => {
		if (rule.condition(fakta)) {
			firedRules.push(rule);
			Object.entries(rule.score).forEach(([plant, val]) => {
				if (val !== undefined) {
					scores[plant as Plant] += val;
				}
			});
		}
	});

	// 3. Ranking berdasarkan skor
	const maxScore = Math.max(...Object.values(scores));
	const ranked = Object.entries(scores)
		.sort((a, b) => b[1] - a[1])
		.filter(([, score]) => score > 0)
		.map(([plant, score]) => {
			const p = plant as Plant;
			return {
				plant: p,
				label: PLANT_LABELS[p],
				image: `/images/${p.replace('_', '-')}.webp`,
				score,
				level: getLevel(score, maxScore),
				contributors: firedRules.filter((r) => r.score[p] !== undefined)
			};
		});

	return { ranked, firedRules, scores };
}

function getLevel(score: number, maxScore: number): string {
	// ponytail: handle division by zero or negative maxScore safely
	if (maxScore <= 0) return 'Cukup Sesuai';
	const ratio = score / maxScore;
	if (ratio >= 0.7) return 'Sangat Direkomendasikan';
	if (ratio >= 0.4) return 'Direkomendasikan';
	return 'Cukup Sesuai';
}
