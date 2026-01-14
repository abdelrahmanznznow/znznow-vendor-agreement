import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  FileText, 
  CheckCircle2, 
  Shield, 
  Clock,
  ArrowRight,
  Compass,
  UtensilsCrossed,
  Building2
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">Z</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-primary">ZNZNOW</h1>
                <p className="text-xs text-muted-foreground">Vendor Onboarding</p>
              </div>
            </div>
            <Link href="/agreement">
              <Button>
                Start Agreement
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Partner with <span className="text-primary">ZNZNOW</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join Zanzibar's leading tourism and hospitality platform. 
          Complete your vendor partnership agreement digitally in minutes.
        </p>
        <Link href="/agreement">
          <Button size="lg" className="text-lg px-8">
            <FileText className="w-5 h-5 mr-2" />
            Complete Your Agreement
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="container py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Quick & Easy</CardTitle>
              <CardDescription>
                Complete your partnership agreement in under 5 minutes with our streamlined digital process.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Secure & Legal</CardTitle>
              <CardDescription>
                Digital signatures are legally binding. Your data is encrypted and securely stored.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Instant Confirmation</CardTitle>
              <CardDescription>
                Receive your signed agreement immediately via email and download as PDF.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Agreement Types */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Choose Your Partnership Type</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Compass className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Tours & Activities</CardTitle>
                  <CardDescription>
                    For tour operators, excursion providers, and experience hosts
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Commission-based partnership
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Weekly settlements
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Marketing support included
                </li>
              </ul>
              <Link href="/agreement">
                <Button variant="outline" className="w-full">
                  Start Tours Agreement
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <CardTitle>Restaurant</CardTitle>
                  <CardDescription>
                    For restaurants, cafes, and dining establishments
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Flexible commission rates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Reservation management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Featured listings available
                </li>
              </ul>
              <Link href="/agreement">
                <Button variant="outline" className="w-full">
                  Start Restaurant Agreement
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, title: "Select Type", desc: "Choose Tours or Restaurant agreement" },
              { step: 2, title: "Fill Details", desc: "Enter your business information" },
              { step: 3, title: "Review Terms", desc: "Read the full agreement carefully" },
              { step: 4, title: "Sign & Submit", desc: "Add your digital signature" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 text-center">
        <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Partner with ZNZNOW?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Complete your vendor agreement today and start reaching more customers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/agreement">
              <Button variant="secondary" size="lg">
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">Z</span>
              </div>
              <div>
                <p className="font-semibold text-sm">Zanzisouk LTD</p>
                <p className="text-xs text-muted-foreground">Trading as ZNZNOW</p>
              </div>
            </div>
            <div className="text-center md:text-right text-sm text-muted-foreground">
              <p>Migoz Plaza, Nyerere Road, Zanzibar, Tanzania</p>
              <p>contact@znznow.com</p>
            </div>
          </div>
          <div className="border-t mt-6 pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Zanzisouk LTD. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
