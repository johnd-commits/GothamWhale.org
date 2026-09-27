import { StyleSheet, View } from 'react-native';
import { Fit, RiveView, useRiveFile } from '@rive-app/react-native';

import { MascotPlaceholder } from '@/components/mascot-placeholder';
import { mascotFile, mascotStateMachine } from '@/components/mascot-file';
import type { MascotState } from '@/theme/motion';

type MascotProps = {
  state: MascotState;
};

function RiveMascot({ state }: MascotProps) {
  const { riveFile, error } = useRiveFile(mascotFile ?? undefined);

  if (!riveFile || error) {
    return <MascotPlaceholder state={state} />;
  }

  return (
    <View accessibilityRole="image" accessibilityLabel={`Mascot is ${state}`} style={styles.frame}>
      <RiveView
        key={state}
        file={riveFile}
        stateMachineName={mascotStateMachine}
        autoPlay
        fit={Fit.Contain}
        onError={() => undefined}
        style={styles.frame}
      />
    </View>
  );
}

export function Mascot({ state }: MascotProps) {
  if (mascotFile == null) {
    return <MascotPlaceholder state={state} />;
  }
  return <RiveMascot state={state} />;
}

const styles = StyleSheet.create({
  frame: {
    width: 180,
    height: 180,
  },
});
