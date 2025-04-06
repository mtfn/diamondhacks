"use client";

const challengeSets = [
  {
    title: "File System Basics",
    description: "Learn essential commands for file and directory manipulation",
    exercises: 10,
    difficulty: "Beginner",
    icon: "📁",
    id: 0,
  },
  {
    title: "Text Processing",
    description: "Master grep, sed, awk and other text processing tools",
    exercises: 12,
    difficulty: "Intermediate",
    icon: "📝",
  },
  {
    title: "Process Management",
    description: "Understand processes, jobs, and system monitoring",
    exercises: 8,
    difficulty: "Expert",
    icon: "⚙️",
  },
  {
    title: "Shell Scripting",
    description: "Create powerful shell scripts and automate tasks",
    exercises: 15,
    difficulty: "Intermediate",
    icon: "🔧",
  },
  {
    title: "Network Tools",
    description: "Learn networking commands and diagnostics",
    exercises: 10,
    difficulty: "Expert",
    icon: "🌐",
  },
];

export default function ChallengeSelect() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to CLASH</h1>
        <p className="text-xl">
          Select a challenge set to start on your command line journey!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challengeSets.map((set, index) => (
          <div
            key={index}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="card-body">
              <div className="text-4xl mb-4">{set.icon}</div>
              <h2 className="card-title">{set.title}</h2>
              <p className="text-gray-600">{set.description}</p>
              <div className="flex justify-between items-center mt-4">
                <div className={badgeByDifficulty(set.difficulty)}>
                  {set.difficulty}
                </div>
                <div className="text-sm text-gray-500">
                  {set.exercises} exercises
                </div>
              </div>
              <div className="card-actions justify-end mt-4">
                {set.id !== undefined ? (
                  <a href={`/app/${set.id}`} className="btn btn-primary">
                    Start Challenge
                  </a>
                ) : (
                  <button disabled className="btn btn-primary">
                    Start Challenge
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function badgeByDifficulty(diff: string) {
  if (diff === "Beginner") {
    return "badge badge-success";
  } else if (diff === "Intermediate") {
    return "badge badge-warning";
  } else if (diff === "Expert") {
    return "badge badge-error";
  } else {
    return "badge badge-primary";
  }
}
