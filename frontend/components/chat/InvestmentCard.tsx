import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface AssetAllocation {
  asset: string;
  percentage: number;
  returns: number;
  emoji: string;
  color: string;
}

interface InvestmentCardProps {
  currentValue: number;
  invested: number;
  totalReturns: number;
  returnsPercentage: number;
  assets: AssetAllocation[];
}

export default function InvestmentCard({
  currentValue,
  invested,
  totalReturns,
  returnsPercentage,
  assets,
}: InvestmentCardProps) {
  const isProfit = totalReturns >= 0;
  
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Portfolio Performance</Text>
        <Text style={[
          styles.returnsPercentage,
          { color: isProfit ? COLORS.success : COLORS.error }
        ]}>
          {isProfit ? '+' : ''}{returnsPercentage.toFixed(1)}%
        </Text>
      </View>
      
      {/* Values */}
      <View style={styles.valuesContainer}>
        <View style={styles.valueBox}>
          <Text style={styles.valueLabel}>Current Value</Text>
          <Text style={styles.valueLarge}>₹{(currentValue / 100000).toFixed(2)}L</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.valueBox}>
          <Text style={styles.valueLabel}>Returns</Text>
          <Text style={[
            styles.valueReturns,
            { color: isProfit ? COLORS.success : COLORS.error }
          ]}>
            {isProfit ? '+' : ''}₹{Math.abs(totalReturns).toLocaleString('en-IN')}
          </Text>
        </View>
      </View>
      
      {/* Asset Allocation */}
      <View style={styles.assetsSection}>
        <Text style={styles.sectionTitle}>Asset Allocation</Text>
        
        {/* Donut-like visual */}
        <View style={styles.donutContainer}>
          <View style={styles.donutBarBg}>
            {assets.map((asset, index) => (
              <View
                key={index}
                style={[
                  styles.donutSegment,
                  {
                    width: `${asset.percentage}%`,
                    backgroundColor: asset.color,
                  },
                ]}
              />
            ))}
          </View>
        </View>
        
        {/* Asset List */}
        <View style={styles.assetList}>
          {assets.map((asset, index) => (
            <View key={index} style={styles.assetRow}>
              <View style={styles.assetLeft}>
                <View style={[styles.colorDot, { backgroundColor: asset.color }]} />
                <Text style={styles.assetEmoji}>{asset.emoji}</Text>
                <Text style={styles.assetName}>{asset.asset}</Text>
              </View>
              <View style={styles.assetRight}>
                <Text style={styles.assetPercentage}>{asset.percentage}%</Text>
                <Text style={[
                  styles.assetReturns,
                  { color: asset.returns >= 0 ? COLORS.success : COLORS.error }
                ]}>
                  {asset.returns >= 0 ? '+' : ''}{asset.returns}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
  },
  returnsPercentage: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.heading,
  },
  valuesContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  valueBox: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  valueLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.body,
    marginBottom: SPACING.xs / 2,
  },
  valueLarge: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
  },
  valueReturns: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.heading,
  },
  assetsSection: {
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
    marginBottom: SPACING.md,
  },
  donutContainer: {
    marginBottom: SPACING.lg,
  },
  donutBarBg: {
    height: 20,
    backgroundColor: COLORS.border,
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  donutSegment: {
    height: '100%',
  },
  assetList: {
    gap: SPACING.md,
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  assetEmoji: {
    fontSize: 18,
  },
  assetName: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.body,
    fontWeight: '500',
  },
  assetRight: {
    alignItems: 'flex-end',
    gap: SPACING.xs / 2,
  },
  assetPercentage: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.heading,
  },
  assetReturns: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.body,
  },
});
