import { notFound } from 'next/navigation';
import { getQuizBySlug, quizzes } from '@/config/quizzes';
import QuizRunner from '@/components/QuizRunner';
import Link from 'next/link';

export function generateStaticParams() {
  return quizzes.map((quiz) => ({
    slug: quiz.slug,
  }));
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quiz = getQuizBySlug(slug);

  if (!quiz) {
    notFound();
  }

  return (
    <>
      <header className="max-w-6xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-scan"></div>
          </div>
          <Link href="/" className="font-display font-bold text-lg tracking-tight">FaceLab</Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto flex-1">
        <QuizRunner quiz={quiz} />
      </main>
    </>
  );
}
