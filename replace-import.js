const fs = require('fs');
const path = require('path');

const hookFixes = {
  // Admin Dashboard
  'admin/dashboard/page.tsx': {
    76: ['router']
  },
  // Leaderboard
  'admin/leaderboard/[testCode]/page.tsx': {
    72: ['router']
  },
  // Report Card
  'report-card/page.tsx': {
    20: ['router']
  },
  // Quiz Component
  '_ui/components/Quiz.tsx': {
    67: ['fetchQuestions'],
    142: ['setupTimer'],
    154: ['handleNextQuestion', 'quizFinished', 'selectedAnswerIndex']
  },
  // Quiz Results
  '_ui/components/QuizResults.tsx': {
    58: ['fetchLeaderboard']
  },
  // Report Card Component
  '_ui/components/ReportCard.tsx': {
    173: ['calculatePerformanceStats', 'fetchTopicsForSubject']
  },
  // Subject Select
  '_ui/components/SubjectSelect.tsx': {
    128: ['isValidTestInfo']
  }
};

const processFiles = () => {
  Object.entries(hookFixes).forEach(([filePath, fixes]) => {
    const fullPath = path.join('src/app', filePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      content = content.split('\n').map((line, index) => {
        const lineNumber = index + 1;
        if (fixes[lineNumber]) {
          if (line.includes('useEffect') || line.includes('useCallback')) {
            const closingBracketIndex = line.lastIndexOf(']');
            if (closingBracketIndex > 0) {
              modified = true;
              const beforeDeps = line.substring(0, closingBracketIndex);
              const afterDeps = line.substring(closingBracketIndex);
              return `${beforeDeps}, ${fixes[lineNumber].join(', ')}${afterDeps}`;
            }
          }
        }
        return line;
      }).join('\n');

      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`✅ Fixed dependencies in ${filePath}`);
      }
    } else {
      console.warn(`⚠️  File not found: ${filePath}`);
    }
  });
};

processFiles();
console.log('🎉 All React Hook dependency fixes applied!');