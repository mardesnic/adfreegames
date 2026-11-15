// The AdFreeGames icon: takes the player to the list of all games. It is the
// app's own favicon.svg, so it always matches the app icon.
export function HomeLink({ label }: { label: string }) {
  return (
    <a className='home-link' href={import.meta.env.BASE_URL} aria-label={label}>
      <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt='' />
    </a>
  );
}
