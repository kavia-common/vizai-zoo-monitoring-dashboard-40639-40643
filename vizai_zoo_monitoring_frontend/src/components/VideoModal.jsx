import React from 'react';

/**
 * PUBLIC_INTERFACE
 * VideoModal displays a video player with metadata.
 * Props:
 * - title: string displayed in the modal header (passed via ModalHost title)
 * - src: video source URL
 * - poster: poster image for the video
 * - details: object with event context details to render under the video
 */
export default function VideoModal({ src, poster, details = {} }) {
  return (
    <div>
      <div style={{ display: 'grid', gap: 10 }}>
        <video
          controls
          style={{ width: '100%', borderRadius: 10, border: '1px solid var(--color-border)', background: 'black' }}
          src={src}
          poster={poster}
        />
        <div className="card" style={{ background: 'var(--color-surface-2)' }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <div style={{ fontWeight: 700 }}>Event Details</div>
            <div style={{ color: 'var(--color-text-muted)' }}>
              {details.timestamp ? <span>Time: {details.timestamp}</span> : null}
              {details.behavior ? <span style={{ marginLeft: 10 }}>Behavior: {details.behavior}</span> : null}
              {details.duration ? <span style={{ marginLeft: 10 }}>Duration: {details.duration} sec</span> : null}
              {details.timeOfDay ? <span style={{ marginLeft: 10 }}>Time of day: {details.timeOfDay}</span> : null}
            </div>
            {details.notes ? (
              <div style={{ marginTop: 6 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Notes</div>
                <div className="page-desc">{details.notes}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
