import { Link, useParams } from 'react-router-dom';
import { formatDate, mapAlbum, publicApi, usePublicFeed } from '../api/public.js';
import { FeedError, FeedSkeleton, friendlyFeedError, hideImage } from '../components/FeedStates.jsx';

function AlbumDetail({ slug }) {
  const { data, loading, error, retry } = usePublicFeed(
    () => publicApi.getAlbumBySlug(slug).then((a) => (a ? mapAlbum(a) : null)),
    `album-${slug}`,
  );
  return (
    <div className="gdg-container">
      <section className="gdg-section">
        <Link to="/gallery" className="gdg-btn gdg-btn-secondary">← All albums</Link>
        {loading ? <FeedSkeleton count={4} label="Loading album…" /> : null}
        {!loading && (error || !data) ? (
          <FeedError message={error ? friendlyFeedError(error) : 'This album is not published.'} onRetry={retry} />
        ) : null}
        {!loading && !error && data ? (
          <>
            <span className="gdg-badge">Album</span>
            <h2>{data.title}</h2>
            {data.description ? <p className="gdg-subtitle">{data.description}</p> : null}
            <div className="gdg-card-meta">
              {data.date ? <span>{formatDate(data.date)}</span> : null}
              <span>{data.items.length} Photos</span>
            </div>
            {data.items.length ? (
              <div className="gdg-grid">
                {data.items.map((photo) => (
                  <div key={photo.id} className="gdg-card">
                    {photo.url ? (
                      <img className="gdg-photo" src={photo.url} alt={photo.alt} loading="lazy" onError={hideImage} />
                    ) : null}
                    {photo.caption ? <p>{photo.caption}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="gdg-subtitle">No photos in this album yet.</p>
            )}
          </>
        ) : null}
      </section>
    </div>
  );
}

export default function Gallery() {
  const { slug } = useParams();
  if (slug) return <AlbumDetail slug={slug} />;
  return <GalleryList />;
}

function GalleryList() {
  const { data, loading, error, retry } = usePublicFeed(
    () => publicApi.getAlbums().then((rows) => rows.map(mapAlbum)),
    'gallery-albums',
  );

  return (
    <div className="gdg-container">
      <section className="gdg-section">
        <span className="gdg-badge">Our Memories</span>
        <h2>
          Captured <span className="gdg-gradient-text">Moments</span>
        </h2>
        <p className="gdg-subtitle">
          Discover the memorable events, workshops, bootcamps, hackathons, and
          community activities that shaped GDG - Cebu Technological University
          - Main Campus.
        </p>
        {loading ? <FeedSkeleton label="Loading albums…" /> : null}
        {!loading && error ? <FeedError message={friendlyFeedError(error)} onRetry={retry} /> : null}
        {!loading && !error && (!data || data.length === 0) ? (
          <p className="gdg-subtitle">No albums published yet — check back soon.</p>
        ) : null}
        {!loading && !error && data?.length ? (
          <div className="gdg-grid">
            {data.map((album) => (
              <Link
                key={album.id}
                to={album.slug ? `/gallery/${album.slug}` : '/gallery'}
                className="gdg-card gdg-card-link"
              >
                {album.coverUrl ? (
                  <img className="gdg-photo" src={album.coverUrl} alt={album.coverAlt} loading="lazy" onError={hideImage} />
                ) : (
                  <div className="gdg-photo-fallback">{album.title.charAt(0)}</div>
                )}
                <h3>{album.title}</h3>
                {album.description ? <p>{album.description}</p> : null}
                <div className="gdg-card-meta">
                  {album.date ? <span>{formatDate(album.date)}</span> : null}
                  <span>{album.photoCount} Photos</span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
