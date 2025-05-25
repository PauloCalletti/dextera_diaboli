import { useAudioStore } from "../store/useAudioStore";
import "./VolumeController.css";

export const VolumeController = () => {
  const { volume, setVolume } = useAudioStore();

  const getVolumeIcon = (vol: number) => {
    if (vol === 0) return "🔇";
    if (vol < 0.3) return "🔈";
    if (vol < 0.7) return "🔉";
    return "🔊";
  };

  const formatVolume = (vol: number) => {
    return `${Math.round(vol * 100)}%`;
  };

  return (
    <div className="volume-controller">
      <span className="volume-icon">{getVolumeIcon(volume)}</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="volume-slider"
      />
      <span className="volume-percentage">{formatVolume(volume)}</span>
    </div>
  );
};
