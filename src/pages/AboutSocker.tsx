import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Cat, Heart } from 'lucide-react'
import Layout from '@/components/Layout'

function AboutSocker() {
  return (
    <Layout>
      {/* Main content */}
      <div className="max-w-4xl mx-auto">
        {/* Hero section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-nordic-blue/10 mb-6">
            <Cat className="w-10 h-10 text-nordic-blue" />
          </div>
          <h1 className="text-4xl font-semibold text-charcoal mb-4">
            About Socker Studio
          </h1>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            The story behind our name and the sweet inspiration that drives our creativity
          </p>
        </div>

        {/* Sugar's photo */}
        <div className="mb-12">
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <img
              src="/image/my-little-socker.jpg"
              alt="Sugar - the beloved orange tabby cat"
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <div className="flex items-center gap-2 text-white">
                <Heart className="w-5 h-5 fill-current" />
                <span className="font-medium">Sugar - My Little Socker</span>
              </div>
            </div>
          </div>
        </div>

        {/* Story section */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-3xl border border-stone-100 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-6 flex items-center gap-3">
              <Cat className="w-6 h-6 text-nordic-blue" />
              The Meaning of Socker
            </h2>
            <p className="text-slate leading-relaxed mb-6">
              <strong className="text-charcoal">Socker</strong> means "sugar" in Swedish. 
              This studio is named after my beloved orange tabby cat, Sugar, who was the sweetest 
              companion I could have ever asked for.
            </p>
            <p className="text-slate leading-relaxed mb-6">
              Sugar was more than just a pet—she was a source of endless joy, warmth, and inspiration. 
              Her gentle purrs would fill the room with comfort, and her playful antics never failed 
              to bring a smile to my face. She had a way of making even the most ordinary moments feel special.
            </p>
            <p className="text-slate leading-relaxed mb-6">
              Though she has passed away, her memory lives on through this creative space. 
              Every design we create, every product we curate, carries a piece of her gentle spirit. 
              The warmth, the comfort, the simple joys—these are the qualities we strive to bring 
              into your home through our work.
            </p>
            <div className="bg-nordic-blue/5 rounded-2xl p-6 border-l-4 border-nordic-blue">
              <p className="text-charcoal font-medium italic">
                "Sugar taught me that the best things in life are often the simplest—a warm sunbeam, 
                a gentle touch, a moment of peace. These are the values we weave into every piece 
                we create at Socker Studio."
              </p>
            </div>
          </div>

          {/* Values section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-stone-100 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-sage" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Warmth</h3>
              <p className="text-sm text-slate">
                Like Sugar's comforting presence, our designs bring warmth and coziness to your space.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-cedar/20 flex items-center justify-center mx-auto mb-4">
                <Cat className="w-6 h-6 text-cedar" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Simplicity</h3>
              <p className="text-sm text-slate">
                Inspired by the elegant simplicity of a cat's grace, we embrace clean, minimalist design.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-ash/20 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-rose-ash" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Joy</h3>
              <p className="text-sm text-slate">
                Just as Sugar brought joy to our lives, we aim to create pieces that spark happiness.
              </p>
            </div>
          </div>

          {/* CTA section */}
          <div className="text-center">
            <Link to="/">
              <Button size="lg" className="px-8">
                <Cat className="w-5 h-5 mr-2" />
                Explore Our Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Cat className="w-5 h-5 text-nordic-blue" />
              <span className="font-semibold text-charcoal">Socker Studio</span>
            </div>
            <p className="text-sm text-slate">
              In memory of Sugar, who taught us that sweetness comes in many forms.
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  )
}

export default AboutSocker