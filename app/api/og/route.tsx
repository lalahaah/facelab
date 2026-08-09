import { ImageResponse } from 'next/og';
import { getQuizBySlug } from '@/config/quizzes';

export const runtime = 'edge';

const colors = {
  blood: '#E63950',
  amber: '#F2A93C',
  jade: '#1FA37D',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const quizSlug = searchParams.get('quiz');
    const result = searchParams.get('result');
    const accuracy = searchParams.get('accuracy');

    if (!quizSlug || !result) {
      return new Response('Missing required parameters', { status: 400 });
    }

    const quiz = getQuizBySlug(quizSlug);
    if (!quiz) {
      return new Response('Invalid quiz slug', { status: 400 });
    }

    const accentHex = colors[quiz.accentColor];

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#12141A',
            color: '#F5F6F2',
            width: '100%',
            height: '100%',
            padding: '60px 40px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-start',
            }}
          >
            <span
              style={{
                color: accentHex,
                fontSize: 20,
                letterSpacing: '0.05em',
                fontWeight: 600,
              }}
            >
              FACELAB · {quiz.labNumber}
            </span>
          </div>

          {/* Center */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                color: 'rgba(245, 246, 242, 0.6)',
                fontSize: 24,
                marginBottom: 16,
              }}
            >
              당신의 {quiz.title}은
            </span>
            <span
              style={{
                fontSize: 80,
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: accuracy ? 16 : 0,
              }}
            >
              {result}
            </span>
            {accuracy && (
              <span
                style={{
                  color: 'rgba(245, 246, 242, 0.6)',
                  fontSize: 24,
                }}
              >
                일치율 {accuracy}%
              </span>
            )}
          </div>

          {/* Bottom */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                color: 'rgba(245, 246, 242, 0.5)',
                fontSize: 18,
                letterSpacing: '0.02em',
              }}
            >
              facelab.app
            </span>
          </div>
        </div>
      ),
      {
        width: 540,
        height: 960,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
