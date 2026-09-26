import { NativeTabs } from 'expo-router/unstable-native-tabs'

import { Colors } from '@/constants/theme'

export default function AppTabs() {
  const colors = Colors.light

  return (
    <NativeTabs
      backgroundColor={colors.cream}
      tintColor={colors.orange}
      indicatorColor={colors.orangeLight}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: 'house',
            selected: 'house.fill',
          }}
          md={{
            default: 'home',
            selected: 'home',
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="slices">
        <NativeTabs.Trigger.Label>Slices</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: 'circle.grid.2x2',
            selected: 'circle.grid.2x2.fill',
          }}
          md={{
            default: 'grid_view',
            selected: 'grid_view',
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="add">
        <NativeTabs.Trigger.Label>AI</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: 'plus.circle',
            selected: 'plus.circle.fill',
          }}
          md={{
            default: 'add_circle',
            selected: 'add_circle',
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: 'person',
            selected: 'person.fill',
          }}
          md={{
            default: 'person',
            selected: 'person',
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}