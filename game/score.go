// Copyright 2022 Team 254. All Rights Reserved.
// Author: pat@patfairbank.com (Patrick Fairbank)
//
// Model representing the instantaneous score of a match.

package game

type Score struct {
	LavaCount        int
	HasEruptionBonus bool
	Climbs           [3]bool
	Fouls            []Foul
}

type ScoreSummary struct {
	Score            int
	EndgameScore     int
	LavaScore        int
	LavaCount        int
	MatchPoints      int
	FoulPoints       int
	HasEruptionBonus bool
	BonusPoints      int
}

var BonusThreshold = 10
var BonusPoints = 8

// Calculates and returns the summary fields used for ranking and display.
func (score *Score) Summarize(opponentFouls []Foul) *ScoreSummary {
	summary := new(ScoreSummary)

	summary.LavaCount = score.LavaCount
	summary.LavaScore = summary.LavaCount
	summary.MatchPoints = summary.LavaCount

	// Calculate penalty points.
	for _, foul := range score.Fouls {
		summary.FoulPoints -= foul.PointValue()
	}

	if score.HasEruptionBonus {
		summary.HasEruptionBonus = true
		summary.BonusPoints = BonusPoints
		summary.MatchPoints += BonusPoints
	}

	summary.Score = summary.MatchPoints + summary.FoulPoints

	// Calculate climb points
	for _, climbed := range score.Climbs {
		if climbed {
			summary.EndgameScore += 5
		}
	}

	summary.Score += summary.EndgameScore

	return summary
}

// Returns true if and only if all fields of the two scores are equal.
func (score *Score) Equals(other *Score) bool {
	if score.LavaCount != other.LavaCount ||
		len(score.Fouls) != len(other.Fouls) {
		return false
	}

	for i, foul := range score.Fouls {
		if foul != other.Fouls[i] {
			return false
		}
	}

	return true
}
