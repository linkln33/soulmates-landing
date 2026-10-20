/**
 * The Oracle presented as a borderless glass card: the artwork, a title, an
 * optional description and a call to action that reflects the real state.
 *
 * Truthfulness: `availability` is required and nothing here claims the
 * Oracle is available. 'available' shows a button (a link when `href` is
 * given); 'unavailable' shows a plain note instead of a button, by default
 * "The Oracle is available in the app." No prices, no predictions.
 */
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { OracleOrb, type OracleVariant } from './OracleOrb';

export type OracleAvailability = 'available' | 'unavailable';

export const ORACLE_UNAVAILABLE_TEXT = 'The Oracle is available in the app.';

export interface OracleCardProps {
  /** The real state, from the caller. Required: there is no default that could overstate it. */
  availability: OracleAvailability;
  variant?: OracleVariant;
  title?: string;
  description?: string;
  /** Button label when available. */
  ctaLabel?: string;
  /** Link target when available (renders an <a>); otherwise a <button> calling onAction. */
  href?: string;
  onAction?: () => void;
  /** Note shown instead of a button when unavailable. */
  unavailableText?: string;
  /** Heading level for the title, so the card fits the page outline. Default 2. */
  headingLevel?: 2 | 3 | 4;
  entrance?: boolean;
  className?: string;
}

export function OracleCard({
  availability,
  variant = 'main',
  title = 'SoulMates Oracle',
  description,
  ctaLabel = 'Open the Oracle',
  href,
  onAction,
  unavailableText = ORACLE_UNAVAILABLE_TEXT,
  headingLevel = 2,
  entrance = true,
  className,
}: OracleCardProps) {
  const Heading = `h${headingLevel}` as const;
  const available = availability === 'available';
  return (
    <Card className={cn('oracle-card items-center bg-[var(--oracle-card-bg)] text-center', className)} data-availability={availability}>
      <div className="oracle-card__stage">
        <OracleOrb variant={variant} size="large" entrance={entrance} />
      </div>
      <CardHeader className="justify-items-center">
        <Heading data-slot="card-title" className="oracle-card__title text-lg leading-snug font-semibold">
          {title}
        </Heading>
        {description ? <CardDescription className="oracle-card__text">{description}</CardDescription> : null}
      </CardHeader>
      <CardFooter className="justify-center">
        {available ? (
          href ? (
            <Button asChild>
              <a href={href}>{ctaLabel}</a>
            </Button>
          ) : (
            <Button type="button" onClick={onAction}>
              {ctaLabel}
            </Button>
          )
        ) : (
          <p className="oracle-card__note">{unavailableText}</p>
        )}
      </CardFooter>
    </Card>
  );
}
