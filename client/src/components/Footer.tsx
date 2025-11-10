import { Link } from "wouter";
import { Flower2, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { APP_TITLE } from "@/const";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-sage-200 bg-gradient-to-br from-sage-50 to-rose-50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* À propos */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Flower2 className="h-6 w-6 text-sage-600" />
              <h3 className="font-serif text-lg font-bold text-sage-900">{APP_TITLE}</h3>
            </div>
            <p className="mb-4 text-sm text-sage-600">
              Le langage des fleurs réinventé. Créez des bouquets personnalisés qui expriment vos émotions les plus profondes.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-sage-100 p-2 text-sage-600 transition-colors hover:bg-sage-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-rose-100 p-2 text-rose-600 transition-colors hover:bg-rose-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-blue-100 p-2 text-blue-600 transition-colors hover:bg-blue-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-bold text-sage-900">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-sage-600 transition-colors hover:text-sage-900">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-sage-600 transition-colors hover:text-sage-900">
                  Créer un bouquet
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-sage-600 transition-colors hover:text-sage-900">
                  Catalogue de fleurs
                </Link>
              </li>
              <li>
                <Link href="/scanner" className="text-sage-600 transition-colors hover:text-sage-900">
                  Scanner un bouquet
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sage-600 transition-colors hover:text-sage-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/loyalty-points" className="text-sage-600 transition-colors hover:text-sage-900">
                  Programme de fidélité
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-bold text-sage-900">Informations légales</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cgv" className="text-sage-600 transition-colors hover:text-sage-900">
                  Conditions générales de vente
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-sage-600 transition-colors hover:text-sage-900">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-sage-600 transition-colors hover:text-sage-900">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sage-600 transition-colors hover:text-sage-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-bold text-sage-900">Contact</h3>
            <ul className="space-y-3 text-sm text-sage-600">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>123 Rue des Fleurs<br />75001 Paris, France</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+33123456789" className="transition-colors hover:text-sage-900">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:contact@ananas-garden.fr" className="transition-colors hover:text-sage-900">
                  contact@ananas-garden.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-sage-200 pt-6 text-center text-sm text-sage-500">
          <p>© {currentYear} {APP_TITLE}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
