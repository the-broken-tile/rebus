/**
 * Used to split texts containing emojis correctly.
 */
export default function split(string: string): string[] {
  return [...new Intl.Segmenter().segment(string)].map(
    (x: Intl.SegmentData): string => x.segment,
  )
}
