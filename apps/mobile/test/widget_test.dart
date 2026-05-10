import 'package:flutter_test/flutter_test.dart';

import 'package:yemen_marketplace_mobile/main.dart';

void main() {
  testWidgets('renders marketplace home screen', (WidgetTester tester) async {
    await tester.pumpWidget(const YemenMarketplaceApp());

    expect(find.text('سوق اليمن'), findsOneWidget);
    expect(find.text('منظومة طاقة شمسية 5 كيلو'), findsOneWidget);
  });

  testWidgets('switches language from profile screen', (WidgetTester tester) async {
    await tester.pumpWidget(const YemenMarketplaceApp());

    await tester.tap(find.text('حسابي'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('English'));
    await tester.pumpAndSettle();

    expect(find.text('Profile'), findsWidgets);
  });
}
