/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";

interface RelationshipTreeProps {
  currentStage: number; // 0 to 8
  totalStages: number;
}

export const RelationshipTree: React.FC<RelationshipTreeProps> = ({
  currentStage,
}) => {
  // Let's map active elements based on stage progression (0 is Welcome, 8 is Proposal)
  const isTrunkGrown = currentStage >= 1;
  const isBranchesGrown = currentStage >= 3;
  const isLeavesGrown = currentStage >= 4;
  const isBudsGrown = currentStage >= 5;
  const isFlowersGrown = currentStage >= 6;
  const isHeartsGrown = currentStage >= 7;

  return (
    <div id="relationship-tree-container" className="relative flex flex-col items-center justify-center p-3 bg-neutral-900/40 backdrop-blur-md rounded-2xl border border-rose-500/10 shadow-xl max-w-[200px] mx-auto">
      <div className="text-center mb-1">
        <span className="text-[10px] font-mono tracking-widest text-rose-300 uppercase">
          Árvore do Amor
        </span>
        <div className="text-xs font-semibold text-rose-200 mt-0.5">
          {Math.min(100, Math.round((currentStage / 8) * 100))}% Crescida
        </div>
      </div>

      <svg
        id="relationship-tree-svg"
        viewBox="0 0 120 150"
        className="w-24 h-28 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]"
      >
        {/* Pot / Earth Base */}
        <path
          d="M 45 135 L 75 135 L 70 145 L 50 145 Z"
          fill="#3730a3"
          stroke="#818cf8"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <ellipse cx="60" cy="135" rx="14" ry="3" fill="#1e1b4b" />

        {/* Root / Base Trunk */}
        <path
          d="M 60 135 Q 60 120 58 110"
          stroke="#4c1d95"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* MAIN TRUNK - Grows at Stage 1 */}
        {isTrunkGrown && (
          <motion.path
            d="M 58 110 Q 55 80 60 65"
            stroke="#6d28d9"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2 }}
          />
        )}

        {/* LEFT BRANCH - Grows at Stage 3 */}
        {isBranchesGrown && (
          <motion.path
            d="M 57 85 Q 35 75 32 55"
            stroke="#7c3aed"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0 }}
          />
        )}

        {/* RIGHT BRANCH - Grows at Stage 3 */}
        {isBranchesGrown && (
          <motion.path
            d="M 59 78 Q 80 70 82 52"
            stroke="#7c3aed"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0 }}
          />
        )}

        {/* SUB BRANCHES - Grows at Stage 4 */}
        {isLeavesGrown && (
          <>
            {/* Left-top */}
            <motion.path
              d="M 32 55 Q 22 50 25 38"
              stroke="#8b5cf6"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
            {/* Right-top */}
            <motion.path
              d="M 82 52 Q 92 45 88 34"
              stroke="#8b5cf6"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
            {/* Center crown */}
            <motion.path
              d="M 60 65 Q 52 48 60 38"
              stroke="#8b5cf6"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          </>
        )}

        {/* LEAVES - Grows at Stage 4 */}
        {isLeavesGrown && (
          <g>
            {/* Leaf 1 */}
            <motion.path
              d="M 45 80 Q 38 82 42 75 Q 48 74 45 80 Z"
              fill="#10b981"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
            {/* Leaf 2 */}
            <motion.path
              d="M 72 75 Q 78 72 75 79 Q 69 82 72 75 Z"
              fill="#10b981"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
            {/* Leaf 3 */}
            <motion.path
              d="M 32 55 Q 38 52 35 48 Q 29 51 32 55 Z"
              fill="#059669"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
            {/* Leaf 4 */}
            <motion.path
              d="M 82 52 Q 76 49 79 45 Q 85 48 82 52 Z"
              fill="#059669"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          </g>
        )}

        {/* FLOWER BUDS - Grows at Stage 5 */}
        {isBudsGrown && (
          <g>
            <motion.circle cx="25" cy="38" r="3" fill="#fda4af" initial={{ scale: 0 }} animate={{ scale: 1 }} />
            <motion.circle cx="88" cy="34" r="3" fill="#fda4af" initial={{ scale: 0 }} animate={{ scale: 1 }} />
            <motion.circle cx="60" cy="38" r="3.5" fill="#fda4af" initial={{ scale: 0 }} animate={{ scale: 1 }} />
          </g>
        )}

        {/* ROSES/FLOWERS - Blooms at Stage 6 */}
        {isFlowersGrown && (
          <g>
            {/* Left rose */}
            <motion.path
              d="M 25 38 C 22 35, 20 41, 25 43 C 30 41, 28 35, 25 38"
              fill="#f43f5e"
              initial={{ scale: 0 }}
              animate={{ scale: 1.1 }}
            />
            <circle cx="25" cy="39" r="1.5" fill="#fef08a" />

            {/* Right rose */}
            <motion.path
              d="M 88 34 C 85 31, 83 37, 88 39 C 93 37, 91 31, 88 34"
              fill="#f43f5e"
              initial={{ scale: 0 }}
              animate={{ scale: 1.1 }}
            />
            <circle cx="88" cy="35" r="1.5" fill="#fef08a" />

            {/* Top-center rose */}
            <motion.path
              d="M 60 38 C 56 34, 53 42, 60 44 C 67 42, 64 34, 60 38"
              fill="#e11d48"
              initial={{ scale: 0 }}
              animate={{ scale: 1.2 }}
            />
            <circle cx="60" cy="40" r="2" fill="#fef08a" />
          </g>
        )}

        {/* GLOWING HEARTS - Sprout at Stage 7/8 */}
        {isHeartsGrown && (
          <g>
            {/* Center Heart */}
            <motion.path
              d="M 60 20 C 58 16, 54 18, 54 22 C 54 26, 60 30, 60 32 C 60 30, 66 26, 66 22 C 66 18, 62 16, 60 20 Z"
              fill="#ec4899"
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: [1, 1.2, 1], y: 0 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            {/* Tiny hanging left heart */}
            <motion.path
              d="M 18 60 C 17 58, 15 59, 15 61 C 15 63, 18 65, 18 66 C 18 65, 21 63, 21 61 C 21 59, 19 58, 18 60 Z"
              fill="#f43f5e"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
            {/* Tiny hanging right heart */}
            <motion.path
              d="M 102 56 C 101 54, 99 55, 99 57 C 99 59, 102 61, 102 62 C 102 61, 105 59, 105 57 C 105 55, 103 54, 102 56 Z"
              fill="#f43f5e"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          </g>
        )}
      </svg>
    </div>
  );
};
