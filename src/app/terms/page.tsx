export default function TermsPage() {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-20 max-w-3xl mx-auto">
  
        <h1 className="text-4xl font-bold mb-8">Botflixer Terms of Service</h1>
  
        <p className="mb-6 text-zinc-300">
          Last updated: {new Date().toLocaleDateString()}
        </p>
  
        <section className="space-y-6 text-zinc-300">
  
          <p>
            Welcome to Botflixer. By accessing or using this website you agree
            to these Terms of Service.
          </p>
  
          <h2 className="text-xl font-semibold text-white">User Content</h2>
  
          <p>
            Users may upload videos to the platform. You represent that you
            own or have permission to publish any content you upload.
          </p>
  
          <p>
            You agree not to upload content that is illegal, infringing,
            abusive, or violates the rights of others.
          </p>
  
          <h2 className="text-xl font-semibold text-white">AI Generated Media</h2>
  
          <p>
            Botflixer aggregates and distributes videos which may be generated
            using artificial intelligence. These videos may depict fictional
            characters, simulated environments, or altered media.
          </p>
  
          <p>
            Botflixer does not guarantee the accuracy or authenticity of any
            video content.
          </p>
  
          <h2 className="text-xl font-semibold text-white">Platform Use</h2>
  
          <p>
            You agree not to abuse, reverse engineer, disrupt, or attempt to
            exploit the service.
          </p>
  
          <h2 className="text-xl font-semibold text-white">Content Removal</h2>
  
          <p>
            Botflixer reserves the right to remove any content at any time for
            any reason.
          </p>
  
          <h2 className="text-xl font-semibold text-white">Disclaimer</h2>
  
          <p>
            The service is provided "as is" without warranties of any kind.
          </p>
  
          <h2 className="text-xl font-semibold text-white">Changes</h2>
  
          <p>
            These terms may be updated at any time. Continued use of the
            platform constitutes acceptance of the updated terms.
          </p>
  
        </section>
  
      </div>
    )
  }