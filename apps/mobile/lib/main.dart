import 'package:flutter/material.dart';

void main() {
  runApp(const YemenMarketplaceApp());
}

class YemenMarketplaceApp extends StatefulWidget {
  const YemenMarketplaceApp({super.key});

  @override
  State<YemenMarketplaceApp> createState() => _YemenMarketplaceAppState();
}

class _YemenMarketplaceAppState extends State<YemenMarketplaceApp> {
  bool darkMode = false;
  Locale locale = const Locale('ar');

  void toggleTheme() => setState(() => darkMode = !darkMode);

  void toggleLanguage() {
    setState(() {
      locale = locale.languageCode == 'ar' ? const Locale('en') : const Locale('ar');
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Yemen Marketplace',
      locale: locale,
      themeMode: darkMode ? ThemeMode.dark : ThemeMode.light,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      home: Directionality(
        textDirection: locale.languageCode == 'ar' ? TextDirection.rtl : TextDirection.ltr,
        child: MarketplaceShell(
          darkMode: darkMode,
          languageCode: locale.languageCode,
          onThemeChanged: toggleTheme,
          onLanguageChanged: toggleLanguage,
        ),
      ),
    );
  }
}

class AppTheme {
  static const blue = Color(0xFF1D66BD);
  static const ink = Color(0xFF152033);

  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: blue,
        brightness: Brightness.light,
        surface: Colors.white,
      ),
      scaffoldBackgroundColor: const Color(0xFFF7F9FC),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
      ),
      textTheme: const TextTheme(
        titleLarge: TextStyle(fontWeight: FontWeight.w900, color: ink),
        titleMedium: TextStyle(fontWeight: FontWeight.w800, color: ink),
        bodyMedium: TextStyle(color: Color(0xFF475569)),
      ),
    );
  }

  static ThemeData get dark {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: blue,
        brightness: Brightness.dark,
        surface: const Color(0xFF111827),
      ),
      scaffoldBackgroundColor: const Color(0xFF0F1724),
      cardTheme: CardThemeData(
        color: const Color(0xFF111827),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: const BorderSide(color: Color(0xFF263244)),
        ),
      ),
    );
  }
}

class Listing {
  const Listing({
    required this.id,
    required this.titleAr,
    required this.titleEn,
    required this.price,
    required this.city,
    required this.categoryAr,
    required this.categoryEn,
    required this.seller,
    required this.descriptionAr,
    required this.descriptionEn,
    required this.icon,
    this.verified = false,
    this.premium = false,
  });

  final String id;
  final String titleAr;
  final String titleEn;
  final String price;
  final String city;
  final String categoryAr;
  final String categoryEn;
  final String seller;
  final String descriptionAr;
  final String descriptionEn;
  final IconData icon;
  final bool verified;
  final bool premium;
}

const cities = ['صنعاء', 'عدن', 'تعز', 'الحديدة', 'إب', 'حضرموت', 'المكلا', 'ذمار'];

const categories = [
  Category('all', 'الكل', 'All', Icons.apps_rounded),
  Category('cars', 'سيارات', 'Cars', Icons.directions_car_rounded),
  Category('homes', 'عقارات', 'Real Estate', Icons.home_work_rounded),
  Category('phones', 'هواتف', 'Phones', Icons.phone_iphone_rounded),
  Category('electronics', 'إلكترونيات', 'Electronics', Icons.devices_rounded),
  Category('jobs', 'وظائف', 'Jobs', Icons.work_rounded),
  Category('furniture', 'أثاث', 'Furniture', Icons.chair_rounded),
  Category('solar', 'طاقة شمسية', 'Solar', Icons.solar_power_rounded),
  Category('services', 'خدمات', 'Services', Icons.handyman_rounded),
];

const demoListings = [
  Listing(
    id: 'solar-01',
    titleAr: 'منظومة طاقة شمسية 5 كيلو',
    titleEn: '5 kW solar system',
    price: '1,250,000 YER',
    city: 'صنعاء',
    categoryAr: 'طاقة شمسية',
    categoryEn: 'Solar',
    seller: 'شركة النور للطاقة',
    descriptionAr: 'نظام كامل مع ألواح، انفرتر وبطاريات مناسب للمنازل والمتاجر.',
    descriptionEn: 'Complete solar kit with panels, inverter and batteries.',
    icon: Icons.solar_power_rounded,
    verified: true,
    premium: true,
  ),
  Listing(
    id: 'car-01',
    titleAr: 'تويوتا كورولا 2014 نظيفة',
    titleEn: 'Toyota Corolla 2014',
    price: '6,800 USD',
    city: 'عدن',
    categoryAr: 'سيارات',
    categoryEn: 'Cars',
    seller: 'أحمد علي',
    descriptionAr: 'سيارة بحالة ممتازة، فحص كامل، استخدام شخصي وبدون حوادث.',
    descriptionEn: 'Excellent condition, inspected, personal use, no accidents.',
    icon: Icons.directions_car_rounded,
    verified: true,
  ),
  Listing(
    id: 'phone-01',
    titleAr: 'آيفون 13 برو 256 جيجا',
    titleEn: 'iPhone 13 Pro 256 GB',
    price: '460 USD',
    city: 'تعز',
    categoryAr: 'هواتف',
    categoryEn: 'Phones',
    seller: 'متجر التقنية',
    descriptionAr: 'جهاز نظيف، بطارية جيدة، مع الشاحن والكرتون.',
    descriptionEn: 'Clean device, good battery, with charger and box.',
    icon: Icons.phone_iphone_rounded,
  ),
  Listing(
    id: 'service-01',
    titleAr: 'فني تركيب كاميرات مراقبة',
    titleEn: 'Security camera installation',
    price: 'حسب الطلب',
    city: 'إب',
    categoryAr: 'خدمات',
    categoryEn: 'Services',
    seller: 'خدمات الأمان',
    descriptionAr: 'تركيب وصيانة كاميرات للمنازل والمحلات مع ضمان.',
    descriptionEn: 'Installation and maintenance for homes and shops.',
    icon: Icons.handyman_rounded,
    verified: true,
  ),
];

class Category {
  const Category(this.id, this.ar, this.en, this.icon);

  final String id;
  final String ar;
  final String en;
  final IconData icon;
}

class MarketplaceShell extends StatefulWidget {
  const MarketplaceShell({
    super.key,
    required this.darkMode,
    required this.languageCode,
    required this.onThemeChanged,
    required this.onLanguageChanged,
  });

  final bool darkMode;
  final String languageCode;
  final VoidCallback onThemeChanged;
  final VoidCallback onLanguageChanged;

  @override
  State<MarketplaceShell> createState() => _MarketplaceShellState();
}

class _MarketplaceShellState extends State<MarketplaceShell> {
  int currentIndex = 0;
  final favoriteIds = <String>{};

  bool get isArabic => widget.languageCode == 'ar';

  @override
  Widget build(BuildContext context) {
    final pages = [
      HomeScreen(
        isArabic: isArabic,
        favoriteIds: favoriteIds,
        onFavoriteChanged: toggleFavorite,
      ),
      CreateListingScreen(isArabic: isArabic),
      FavoritesScreen(
        isArabic: isArabic,
        favoriteIds: favoriteIds,
        onFavoriteChanged: toggleFavorite,
      ),
      ChatScreen(isArabic: isArabic),
      ProfileScreen(
        isArabic: isArabic,
        darkMode: widget.darkMode,
        onThemeChanged: widget.onThemeChanged,
        onLanguageChanged: widget.onLanguageChanged,
      ),
    ];

    return Scaffold(
      body: pages[currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: (index) => setState(() => currentIndex = index),
        destinations: [
          NavigationDestination(icon: const Icon(Icons.home_rounded), label: isArabic ? 'الرئيسية' : 'Home'),
          NavigationDestination(icon: const Icon(Icons.add_circle_rounded), label: isArabic ? 'بيع' : 'Sell'),
          NavigationDestination(icon: const Icon(Icons.favorite_rounded), label: isArabic ? 'المفضلة' : 'Saved'),
          NavigationDestination(icon: const Icon(Icons.chat_rounded), label: isArabic ? 'الدردشة' : 'Chat'),
          NavigationDestination(icon: const Icon(Icons.person_rounded), label: isArabic ? 'حسابي' : 'Profile'),
        ],
      ),
    );
  }

  void toggleFavorite(String id) {
    setState(() {
      favoriteIds.contains(id) ? favoriteIds.remove(id) : favoriteIds.add(id);
    });
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({
    super.key,
    required this.isArabic,
    required this.favoriteIds,
    required this.onFavoriteChanged,
  });

  final bool isArabic;
  final Set<String> favoriteIds;
  final ValueChanged<String> onFavoriteChanged;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String query = '';
  String selectedCity = 'all';
  String selectedCategory = 'all';

  @override
  Widget build(BuildContext context) {
    final filtered = demoListings.where((listing) {
      final categoryMatch = selectedCategory == 'all' ||
          categories.firstWhere((item) => item.id == selectedCategory).ar == listing.categoryAr;
      final cityMatch = selectedCity == 'all' || listing.city == selectedCity;
      final text = '${listing.titleAr} ${listing.titleEn} ${listing.seller}'.toLowerCase();
      return categoryMatch && cityMatch && text.contains(query.toLowerCase());
    }).toList();

    return SafeArea(
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          widget.isArabic ? 'سوق اليمن' : 'Yemen Market',
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900),
                        ),
                      ),
                      FilledButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.verified_user_rounded, size: 18),
                        label: Text(widget.isArabic ? 'موثوق' : 'Trusted'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  SearchBar(
                    hintText: widget.isArabic ? 'ابحث عن سيارة، هاتف، شقة...' : 'Search cars, phones, apartments...',
                    leading: const Icon(Icons.search_rounded),
                    onChanged: (value) => setState(() => query = value),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 42,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: cities.length + 1,
                      separatorBuilder: (_, __) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        final city = index == 0 ? 'all' : cities[index - 1];
                        final active = city == selectedCity;
                        return ChoiceChip(
                          selected: active,
                          label: Text(city == 'all' ? (widget.isArabic ? 'كل المدن' : 'All cities') : city),
                          onSelected: (_) => setState(() => selectedCity = city),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 92,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: categories.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 10),
                      itemBuilder: (context, index) {
                        final category = categories[index];
                        final active = selectedCategory == category.id;
                        return CategoryTile(
                          category: category,
                          isArabic: widget.isArabic,
                          active: active,
                          onTap: () => setState(() => selectedCategory = category.id),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
            sliver: SliverList.separated(
              itemCount: filtered.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final listing = filtered[index];
                return ListingCardMobile(
                  listing: listing,
                  isArabic: widget.isArabic,
                  favorite: widget.favoriteIds.contains(listing.id),
                  onFavoriteChanged: () => widget.onFavoriteChanged(listing.id),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class CategoryTile extends StatelessWidget {
  const CategoryTile({
    super.key,
    required this.category,
    required this.isArabic,
    required this.active,
    required this.onTap,
  });

  final Category category;
  final bool isArabic;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        width: 92,
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: active ? AppTheme.blue.withValues(alpha: 0.1) : Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: active ? AppTheme.blue : Theme.of(context).dividerColor),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(category.icon, color: active ? AppTheme.blue : null),
            const SizedBox(height: 6),
            Text(
              isArabic ? category.ar : category.en,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}

class ListingCardMobile extends StatelessWidget {
  const ListingCardMobile({
    super.key,
    required this.listing,
    required this.isArabic,
    required this.favorite,
    required this.onFavoriteChanged,
  });

  final Listing listing;
  final bool isArabic;
  final bool favorite;
  final VoidCallback onFavoriteChanged;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: () {
          showModalBottomSheet<void>(
            context: context,
            showDragHandle: true,
            isScrollControlled: true,
            builder: (_) => ListingDetailSheet(listing: listing, isArabic: isArabic),
          );
        },
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 104,
                width: 104,
                decoration: BoxDecoration(
                  color: AppTheme.blue.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(listing.icon, size: 44, color: AppTheme.blue),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            isArabic ? listing.titleAr : listing.titleEn,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
                          ),
                        ),
                        IconButton(
                          onPressed: onFavoriteChanged,
                          icon: Icon(favorite ? Icons.favorite_rounded : Icons.favorite_border_rounded),
                          color: favorite ? Colors.redAccent : null,
                          tooltip: isArabic ? 'حفظ' : 'Save',
                        ),
                      ],
                    ),
                    Text(
                      listing.price,
                      style: const TextStyle(color: AppTheme.blue, fontWeight: FontWeight.w900),
                    ),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: [
                        InfoPill(icon: Icons.place_rounded, label: listing.city),
                        InfoPill(icon: Icons.category_rounded, label: isArabic ? listing.categoryAr : listing.categoryEn),
                        if (listing.verified) InfoPill(icon: Icons.verified_rounded, label: isArabic ? 'موثق' : 'Verified'),
                        if (listing.premium) InfoPill(icon: Icons.bolt_rounded, label: isArabic ? 'مميز' : 'Premium'),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class InfoPill extends StatelessWidget {
  const InfoPill({super.key, required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14),
          const SizedBox(width: 4),
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}

class ListingDetailSheet extends StatelessWidget {
  const ListingDetailSheet({super.key, required this.listing, required this.isArabic});

  final Listing listing;
  final bool isArabic;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 180,
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppTheme.blue.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(listing.icon, size: 72, color: AppTheme.blue),
          ),
          const SizedBox(height: 16),
          Text(isArabic ? listing.titleAr : listing.titleEn, style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 6),
          Text(listing.price, style: const TextStyle(color: AppTheme.blue, fontWeight: FontWeight.w900, fontSize: 18)),
          const SizedBox(height: 10),
          Text(isArabic ? listing.descriptionAr : listing.descriptionEn),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: FilledButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.chat_rounded),
                  label: Text(isArabic ? 'دردشة' : 'Chat'),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.call_rounded),
                  label: const Text('WhatsApp'),
                ),
              ),
            ],
          ),
          TextButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.flag_rounded),
            label: Text(isArabic ? 'الإبلاغ عن الإعلان' : 'Report listing'),
          ),
        ],
      ),
    );
  }
}

class CreateListingScreen extends StatefulWidget {
  const CreateListingScreen({super.key, required this.isArabic});

  final bool isArabic;

  @override
  State<CreateListingScreen> createState() => _CreateListingScreenState();
}

class _CreateListingScreenState extends State<CreateListingScreen> {
  String category = categories[1].id;
  String city = cities.first;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(widget.isArabic ? 'انشر إعلانك' : 'Sell an item', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900)),
          const SizedBox(height: 16),
          TextField(decoration: InputDecoration(labelText: widget.isArabic ? 'عنوان الإعلان' : 'Title', border: const OutlineInputBorder())),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            initialValue: category,
            decoration: InputDecoration(labelText: widget.isArabic ? 'الفئة' : 'Category', border: const OutlineInputBorder()),
            items: categories.skip(1).map((item) {
              return DropdownMenuItem(value: item.id, child: Text(widget.isArabic ? item.ar : item.en));
            }).toList(),
            onChanged: (value) => setState(() => category = value ?? category),
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            initialValue: city,
            decoration: InputDecoration(labelText: widget.isArabic ? 'المدينة' : 'City', border: const OutlineInputBorder()),
            items: cities.map((item) => DropdownMenuItem(value: item, child: Text(item))).toList(),
            onChanged: (value) => setState(() => city = value ?? city),
          ),
          const SizedBox(height: 12),
          TextField(decoration: InputDecoration(labelText: widget.isArabic ? 'السعر' : 'Price', border: const OutlineInputBorder())),
          const SizedBox(height: 12),
          TextField(
            minLines: 4,
            maxLines: 6,
            decoration: InputDecoration(labelText: widget.isArabic ? 'الوصف' : 'Description', border: const OutlineInputBorder()),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.photo_camera_rounded),
            label: Text(widget.isArabic ? 'رفع الصور' : 'Upload photos'),
          ),
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(widget.isArabic ? 'تم حفظ الإعلان كمسودة محلية.' : 'Listing saved as local draft.')),
              );
            },
            icon: const Icon(Icons.send_rounded),
            label: Text(widget.isArabic ? 'نشر الإعلان' : 'Publish listing'),
          ),
        ],
      ),
    );
  }
}

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({
    super.key,
    required this.isArabic,
    required this.favoriteIds,
    required this.onFavoriteChanged,
  });

  final bool isArabic;
  final Set<String> favoriteIds;
  final ValueChanged<String> onFavoriteChanged;

  @override
  Widget build(BuildContext context) {
    final favorites = demoListings.where((listing) => favoriteIds.contains(listing.id)).toList();
    return SafeArea(
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: favorites.length + 1,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          if (index == 0) {
            return Text(isArabic ? 'المفضلة' : 'Saved listings', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900));
          }
          final listing = favorites[index - 1];
          return ListingCardMobile(
            listing: listing,
            isArabic: isArabic,
            favorite: true,
            onFavoriteChanged: () => onFavoriteChanged(listing.id),
          );
        },
      ),
    );
  }
}

class ChatScreen extends StatelessWidget {
  const ChatScreen({super.key, required this.isArabic});

  final bool isArabic;

  @override
  Widget build(BuildContext context) {
    final chats = demoListings.take(3).toList();
    return SafeArea(
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: chats.length + 1,
        separatorBuilder: (_, __) => const Divider(height: 1),
        itemBuilder: (context, index) {
          if (index == 0) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Text(isArabic ? 'الدردشة' : 'Messages', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900)),
            );
          }
          final chat = chats[index - 1];
          return ListTile(
            contentPadding: EdgeInsets.zero,
            leading: CircleAvatar(backgroundColor: AppTheme.blue.withValues(alpha: 0.1), child: Icon(chat.icon, color: AppTheme.blue)),
            title: Text(isArabic ? chat.titleAr : chat.titleEn, maxLines: 1, overflow: TextOverflow.ellipsis),
            subtitle: Text(isArabic ? 'هل الإعلان ما زال متاحا؟' : 'Is this still available?'),
            trailing: const Icon(Icons.chevron_right_rounded),
          );
        },
      ),
    );
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({
    super.key,
    required this.isArabic,
    required this.darkMode,
    required this.onThemeChanged,
    required this.onLanguageChanged,
  });

  final bool isArabic;
  final bool darkMode;
  final VoidCallback onThemeChanged;
  final VoidCallback onLanguageChanged;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(isArabic ? 'حسابي' : 'Profile', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w900)),
          const SizedBox(height: 16),
          Card(
            child: ListTile(
              leading: const CircleAvatar(child: Icon(Icons.person_rounded)),
              title: Text(isArabic ? 'مستخدم موثق' : 'Verified user'),
              subtitle: Text(isArabic ? 'صنعاء · 12 إعلان' : 'Sanaa · 12 listings'),
              trailing: const Icon(Icons.verified_rounded, color: AppTheme.blue),
            ),
          ),
          const SizedBox(height: 12),
          SwitchListTile(
            value: darkMode,
            onChanged: (_) => onThemeChanged(),
            title: Text(isArabic ? 'الوضع الداكن' : 'Dark mode'),
            secondary: const Icon(Icons.dark_mode_rounded),
          ),
          ListTile(
            onTap: onLanguageChanged,
            leading: const Icon(Icons.language_rounded),
            title: Text(isArabic ? 'English' : 'العربية'),
            subtitle: Text(isArabic ? 'تغيير اللغة' : 'Change language'),
          ),
          ListTile(
            leading: const Icon(Icons.shield_rounded),
            title: Text(isArabic ? 'طلب توثيق البائع' : 'Request seller verification'),
          ),
          ListTile(
            leading: const Icon(Icons.notifications_rounded),
            title: Text(isArabic ? 'تنبيهات Push' : 'Push notifications'),
          ),
        ],
      ),
    );
  }
}
