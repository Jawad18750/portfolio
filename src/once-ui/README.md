# Once UI - Design System for Next.js

## Introduction

Once UI is a comprehensive indie design system and component library built specifically for Next.js applications. It provides developers with 110+ pre-built React components featuring built-in styling, animations, and accessibility support, eliminating the need for custom CSS while maintaining complete design flexibility. The library emphasizes a design-first approach with a cohesive design language, customizable themes, and seamless integration with Next.js 13+ server and client component patterns.

At its core, Once UI delivers a rich ecosystem of layout components (Flex, Grid), typography elements (Text, Heading), interactive controls (Button, Input, Select, DatePicker), data visualization tools (BarChart, LineChart, PieChart), and over 15 visual effect components (RevealFx, TypeFx, CountFx, GlitchFx) powered by a robust theming system with 13 color schemes and extensive customization options. The library is distributed as `@once-ui-system/core` (v1.5.2, MIT licensed) and includes full TypeScript support, ARIA accessibility features, and optimized server/client component rendering for superior performance in production environments.

---

## API Documentation and Code Examples

### Installation and Setup

Installing Once UI in a Next.js project

```bash
npm install @once-ui-system/core
```

```typescript
// app/layout.tsx
import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import {
  ThemeProvider,
  LayoutProvider,
  DataThemeProvider,
  ToastProvider,
  IconProvider
} from '@once-ui-system/core';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          theme="light"
          neutral="gray"
          brand="blue"
          accent="indigo"
          solid="contrast"
          solidStyle="flat"
          border="playful"
          surface="filled"
          transition="all"
          scaling="100"
        >
          <LayoutProvider breakpoints={{
            xs: 420,
            s: 560,
            m: 960,
            l: 1280,
            xl: 1600
          }}>
            <DataThemeProvider variant="gradient" mode="categorical">
              <ToastProvider>
                <IconProvider>
                  {children}
                </IconProvider>
              </ToastProvider>
            </DataThemeProvider>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### Layout Components - Flex and Grid

Responsive flexbox and grid layouts with prop-based styling

```typescript
import { Flex, Grid, Column, Row } from '@once-ui-system/core';

export function ResponsiveLayout() {
  return (
    <Flex
      direction="column"
      gap="24"
      padding="32"
      background="surface"
      radius="xl"
      // Responsive breakpoints
      xs={{ direction: "column", gap: "8", padding: "16" }}
      m={{ direction: "row", gap: "24" }}
    >
      <Column fillWidth>
        <Grid
          columns="3"
          gap="16"
          // Mobile: 1 column, Desktop: 3 columns
          s={{ columns: "1" }}
          m={{ columns: "3" }}
        >
          <Flex padding="16" background="brand-medium" radius="m">Item 1</Flex>
          <Flex padding="16" background="brand-medium" radius="m">Item 2</Flex>
          <Flex padding="16" background="brand-medium" radius="m">Item 3</Flex>
        </Grid>
      </Column>

      <Row horizontal="between" vertical="center" fillWidth>
        <Flex>Left</Flex>
        <Flex>Right</Flex>
      </Row>
    </Flex>
  );
}
```

---

### Button Component

Interactive button with variants, icons, and loading states

```typescript
import { Button, IconButton } from '@once-ui-system/core';

export function ButtonExamples() {
  const handleClick = () => {
    console.log('Button clicked');
  };

  return (
    <Flex direction="column" gap="16">
      {/* Primary button with icon */}
      <Button
        variant="primary"
        size="m"
        prefixIcon="copy"
        arrowIcon
        onClick={handleClick}
      >
        Explore docs
      </Button>

      {/* Button as link */}
      <Button
        variant="secondary"
        href="https://docs.once-ui.com"
        suffixIcon="chevronRight"
      >
        View documentation
      </Button>

      {/* Loading state */}
      <Button
        variant="tertiary"
        loading={true}
        disabled={false}
      >
        Processing...
      </Button>

      {/* Full width button */}
      <Button
        variant="danger"
        fillWidth
        rounded
        weight="strong"
      >
        Delete Account
      </Button>

      {/* Icon button */}
      <IconButton
        icon="bell"
        variant="secondary"
        size="m"
        data-border="rounded"
        onClick={handleClick}
      />
    </Flex>
  );
}
```

---

### Input and Form Controls

Text inputs with validation, prefixes, and character counting

```typescript
import { Input, PasswordInput, NumberInput, Textarea } from '@once-ui-system/core';
import { useState } from 'react';

export function FormExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState<number | undefined>();
  const [comment, setComment] = useState('');

  const validateEmail = (value: string) => {
    if (!value.includes('@')) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  return (
    <Flex direction="column" gap="16" maxWidth="m">
      <Input
        id="email"
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        validate={validateEmail}
        hasPrefix={<Icon name="email" size="s" />}
        description="We'll never share your email"
        characterCount
        maxLength={100}
      />

      <PasswordInput
        id="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        description="Must be at least 8 characters"
      />

      <NumberInput
        id="age"
        label="Age"
        value={age}
        onChange={(e) => setAge(parseInt(e.target.value))}
        min={0}
        max={120}
      />

      <Textarea
        id="comment"
        label="Comment"
        placeholder="Enter your comment..."
        lines="auto"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        characterCount
        maxLength={500}
      />
    </Flex>
  );
}
```

---

### Select Component

Searchable dropdown with single and multi-select support

```typescript
import { Select } from '@once-ui-system/core';
import { useState } from 'react';

export function SelectExample() {
  const [country, setCountry] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const countries = [
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "United Kingdom", value: "uk" },
    { label: "Australia", value: "au" },
    { label: "Germany", value: "de" },
    { label: "France", value: "fr" },
    { label: "Japan", value: "jp" },
    { label: "Brazil", value: "br" }
  ];

  const skillOptions = [
    { label: "JavaScript", value: "js" },
    { label: "TypeScript", value: "ts" },
    { label: "React", value: "react" },
    { label: "Node.js", value: "node" }
  ];

  return (
    <Flex direction="column" gap="24" maxWidth="m">
      {/* Single select with search */}
      <Select
        id="country-select"
        label="Choose a country"
        value={country}
        options={countries}
        onSelect={(value) => setCountry(value)}
        searchable
        fillWidth
        emptyState={<Text>No countries found</Text>}
      />

      {/* Multi-select */}
      <Select
        id="skills-select"
        label="Select your skills"
        value={skills}
        options={skillOptions}
        onSelect={(values) => setSkills(Array.isArray(values) ? values : [values])}
        multiple
        searchable
        placeholder="Select multiple options"
        fillWidth
      />
    </Flex>
  );
}
```

---

### Dialog Component

Modal dialogs with custom content and footer actions

```typescript
import { Dialog, Button, Text, Flex } from '@once-ui-system/core';
import { useState } from 'react';

export function DialogExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirm = () => {
    console.log('Confirmed!');
    setIsConfirmOpen(false);
  };

  return (
    <Flex gap="16">
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Open Dialog
      </Button>

      <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
        Delete Item
      </Button>

      {/* Basic dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Welcome"
        description="This is a dialog example"
      >
        <Text>Your custom content goes here</Text>
      </Dialog>

      {/* Confirmation dialog with footer */}
      <Dialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm Deletion"
        description="This action cannot be undone"
        footer={
          <Flex gap="12" horizontal="end" fillWidth>
            <Button
              variant="secondary"
              onClick={() => setIsConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
            >
              Delete
            </Button>
          </Flex>
        }
      >
        <Text>Are you sure you want to delete this item?</Text>
      </Dialog>
    </Flex>
  );
}
```

---

### DatePicker and DateInput

Date and time selection with range support

```typescript
import { DatePicker, DateInput, DateRangeInput, DateRange } from '@once-ui-system/core';
import { useState } from 'react';

export function DatePickerExample() {
  const [date, setDate] = useState<Date>(new Date());
  const [inputDate, setInputDate] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  return (
    <Flex direction="column" gap="24" maxWidth="m">
      {/* Standalone date picker with time */}
      <DatePicker
        id="date-picker"
        value={date}
        onChange={setDate}
        timePicker={true}
        minDate={new Date("2020-01-01")}
        maxDate={new Date("2030-12-31")}
      />

      {/* Date input field */}
      <DateInput
        id="date-input"
        label="Select Date"
        placeholder="Choose a date"
        value={inputDate}
        onChange={setInputDate}
        minDate={new Date("1950-01-01")}
        maxDate={new Date()}
        timePicker={false}
      />

      {/* Date range input */}
      <DateRangeInput
        id="date-range"
        placeholder="Select date range"
        value={dateRange || undefined}
        onChange={setDateRange}
        startLabel="Start Date"
        endLabel="End Date"
      />

      {/* Display selected values */}
      {dateRange && (
        <Text>
          Selected: {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString()}
        </Text>
      )}
    </Flex>
  );
}
```

---

### Toast Notifications

Global notification system with variants

```typescript
import { useToast, Button, Flex } from '@once-ui-system/core';

export function ToastExample() {
  const { addToast } = useToast();

  return (
    <Flex gap="16">
      <Button
        onClick={() => addToast({
          variant: 'success',
          message: 'Profile updated successfully!'
        })}
      >
        Show Success
      </Button>

      <Button
        variant="danger"
        onClick={() => addToast({
          variant: 'danger',
          message: 'An error occurred. Please try again.'
        })}
      >
        Show Error
      </Button>

      <Button
        variant="secondary"
        onClick={() => addToast({
          variant: 'info',
          message: 'You have 3 new notifications'
        })}
      >
        Show Info
      </Button>
    </Flex>
  );
}
```

---

### BarChart Component

Data visualization with customizable series and legends

```typescript
import { BarChart } from '@once-ui-system/core/modules';

export function BarChartExample() {
  const salesData = [
    { label: "Q1 2024", Sales: 45000, Revenue: 38000, Profit: 12000 },
    { label: "Q2 2024", Sales: 52000, Revenue: 44000, Profit: 15000 },
    { label: "Q3 2024", Sales: 61000, Revenue: 53000, Profit: 18500 },
    { label: "Q4 2024", Sales: 58000, Revenue: 49000, Profit: 16000 }
  ];

  return (
    <BarChart
      title="Quarterly Performance 2024"
      description="Sales, revenue, and profit trends"
      data={salesData}
      series={[
        { key: 'Sales', color: 'blue' },
        { key: 'Revenue', color: 'green' },
        { key: 'Profit', color: 'indigo' }
      ]}
      variant="gradient"
      barWidth="xl"
      axis="x"
      grid="y"
      tooltip
      legend={{
        display: true,
        position: 'bottom-center'
      }}
    />
  );
}
```

---

### LineChart Component

Time-series data visualization with date formatting

```typescript
import { LineChart } from '@once-ui-system/core/modules';

export function LineChartExample() {
  const timeSeriesData = [
    {
      date: new Date("1980-01-01"),
      "Median Income": 22340,
      "College Tuition": 3040
    },
    {
      date: new Date("1990-01-01"),
      "Median Income": 31056,
      "College Tuition": 6371
    },
    {
      date: new Date("2000-01-01"),
      "Median Income": 41824,
      "College Tuition": 13467
    },
    {
      date: new Date("2010-01-01"),
      "Median Income": 49341,
      "College Tuition": 18462
    },
    {
      date: new Date("2020-01-01"),
      "Median Income": 52357,
      "College Tuition": 25320
    }
  ];

  return (
    <LineChart
      title="Cost of College vs. Income"
      description="Historical comparison over 40 years"
      data={timeSeriesData}
      series={[
        { key: "Median Income", color: "cyan" },
        { key: "College Tuition", color: "magenta" }
      ]}
      date={{
        format: "yyyy"
      }}
      axis="x"
      grid="both"
      tooltip
      variant="gradient"
      legend={{
        display: true,
        position: "top-right",
        toggle: true
      }}
    />
  );
}
```

---

### CodeBlock Component

Syntax-highlighted code with 140+ language support

```typescript
import { CodeBlock } from '@once-ui-system/core/modules';

export function CodeBlockExample() {
  return (
    <CodeBlock
      lineNumbers
      fullscreenButton
      codeHeight={40}
      codes={[
        {
          code: `function calculateTotal(items) {
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    total += item.price * item.quantity;
  }

  return total;
}`,
          language: "javascript",
          highlight: "2,4-6",
          label: "JavaScript"
        },
        {
          code: `def calculate_total(items):
    total = 0
    for item in items:
        total += item['price'] * item['quantity']
    return total`,
          language: "python",
          label: "Python"
        }
      ]}
    />
  );
}
```

---

### Carousel Component

Image carousel with auto-play and thumbnails

```typescript
import { Carousel } from '@once-ui-system/core';

export function CarouselExample() {
  return (
    <Flex direction="column" gap="24">
      {/* Auto-playing carousel with controls */}
      <Carousel
        items={[
          { slide: "/images/slide1.jpg", alt: "Slide 1" },
          { slide: "/images/slide2.jpg", alt: "Slide 2" },
          { slide: "/images/slide3.jpg", alt: "Slide 3" },
          { slide: "/images/slide4.jpg", alt: "Slide 4" }
        ]}
        play={{
          auto: true,
          interval: 5000,
          controls: true,
          progress: true
        }}
        controls={true}
        indicator="thumbnail"
        aspectRatio="16/9"
        fill
      />

      {/* Carousel with line indicator */}
      <Carousel
        items={[
          { slide: "/images/product1.jpg", alt: "Product 1" },
          { slide: "/images/product2.jpg", alt: "Product 2" }
        ]}
        controls={true}
        indicator="line"
        aspectRatio="4/3"
        priority
      />
    </Flex>
  );
}
```

---

### RevealFx Component

Animated reveal effect for smooth content appearance

```typescript
import { RevealFx, Heading, Text } from '@once-ui-system/core';

export function RevealFxExample() {
  return (
    <RevealFx
      speed="medium"
      delay={0.2}
      translateY={20}
      trigger={true}
      fillWidth
    >
      <Flex direction="column" gap="16" padding="24">
        <Heading variant="display-strong-xl">
          Welcome to Once UI
        </Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          Build with clarity, speed, and quiet confidence
        </Text>
      </Flex>
    </RevealFx>
  );
}
```

---

### TypeFx Component

Typewriter animation effect for text

```typescript
import { TypeFx } from '@once-ui-system/core';

export function TypeFxExample() {
  return (
    <Flex direction="column" gap="24">
      {/* Single word typewriter */}
      <TypeFx
        words="Welcome to Once UI"
        speed={100}
        trigger="instant"
      />

      {/* Looping multiple words */}
      <TypeFx
        words={['Designer', 'Developer', 'Creator']}
        speed={80}
        hold={2000}
        loop
      />
    </Flex>
  );
}
```

---

### CountFx Component

Animated number counting with formatting

```typescript
import { CountFx, Flex } from '@once-ui-system/core';
import { useState, useEffect } from 'react';

export function CountFxExample() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setTimeout(() => setValue(9999), 1000);
  }, []);

  return (
    <Flex direction="column" gap="24">
      {/* Smooth counting */}
      <CountFx
        variant="display-strong-xl"
        value={value}
        speed={3000}
        effect="smooth"
        easing="ease-out"
        separator=","
      />

      {/* Wheel effect */}
      <CountFx
        variant="heading-strong-l"
        value={1234567}
        speed={2000}
        effect="wheel"
        easing="ease-out"
        format={(num) => `$${num.toLocaleString()}`}
      />

      {/* Progress percentage */}
      <CountFx
        value={85}
        speed={1500}
        effect="simple"
        format={(num) => `${num}%`}
      />
    </Flex>
  );
}
```

---

### GlitchFx Component

Glitch visual effect for text and elements

```typescript
import { GlitchFx, Heading } from '@once-ui-system/core';

export function GlitchFxExample() {
  return (
    <Flex direction="column" gap="24">
      {/* Hover-triggered glitch */}
      <GlitchFx speed="fast" trigger="hover">
        <Heading variant="display-strong-xl">
          Hover Me
        </Heading>
      </GlitchFx>

      {/* Continuous glitch */}
      <GlitchFx
        speed="medium"
        trigger="instant"
        continuous
        interval={3000}
      >
        <Text>Continuous Glitch Effect</Text>
      </GlitchFx>
    </Flex>
  );
}
```

---

### Table Component

Sortable data tables with custom styling

```typescript
import { Table } from '@once-ui-system/core';

export function TableExample() {
  return (
    <Table
      background="surface"
      data={{
        headers: [
          { content: "Name", key: "name", sortable: true },
          { content: "Role", key: "role", sortable: true },
          { content: "Email", key: "email", sortable: false },
          { content: "Status", key: "status", sortable: true }
        ],
        rows: [
          ["Alice Johnson", "Engineer", "alice@example.com", "Active"],
          ["Bob Smith", "Designer", "bob@example.com", "Active"],
          ["Carol Davis", "Product Manager", "carol@example.com", "Away"],
          ["David Lee", "Developer", "david@example.com", "Active"]
        ]
      }}
    />
  );
}
```

---

### TagInput Component

Tag-based input for multiple values

```typescript
import { TagInput } from '@once-ui-system/core';
import { useState } from 'react';

export function TagInputExample() {
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript']);

  return (
    <TagInput
      id="skills"
      label="Your Skills"
      placeholder="Type and press Enter"
      value={tags}
      onChange={setTags}
      description="Add skills by typing and pressing Enter"
    />
  );
}
```

---

### Accordion Component

Collapsible content sections

```typescript
import { Accordion, AccordionGroup, Text } from '@once-ui-system/core';

export function AccordionExample() {
  return (
    <Flex direction="column" gap="24" fillWidth>
      {/* Single accordion */}
      <Accordion title="What is Once UI?" open>
        <Text onBackground="neutral-weak">
          Once UI is a comprehensive design system for Next.js applications
          with 110+ components and rich animations.
        </Text>
      </Accordion>

      {/* Accordion group (only one open at a time) */}
      <AccordionGroup
        items={[
          {
            title: "Installation",
            content: (
              <Text onBackground="neutral-weak">
                Install Once UI with: npm install @once-ui-system/core
              </Text>
            )
          },
          {
            title: "Getting Started",
            content: (
              <Text onBackground="neutral-weak">
                Import components and wrap your app with ThemeProvider
              </Text>
            )
          },
          {
            title: "Customization",
            content: (
              <Text onBackground="neutral-weak">
                Customize themes, colors, and styling through provider props
              </Text>
            )
          }
        ]}
      />
    </Flex>
  );
}
```

---

### DropdownWrapper Component

Custom dropdown with floating-ui positioning

```typescript
import { DropdownWrapper, Button, Option, Column, Icon } from '@once-ui-system/core';
import { useState } from 'react';

export function DropdownExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');

  const options = [
    { label: "Dashboard", value: "dashboard", icon: "home" },
    { label: "Settings", value: "settings", icon: "gear" },
    { label: "Profile", value: "profile", icon: "user" },
    { label: "Logout", value: "logout", icon: "signOut" }
  ];

  return (
    <DropdownWrapper
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-end"
      closeAfterClick={true}
      trigger={
        <Button variant="secondary" suffixIcon="chevronDown">
          Menu
        </Button>
      }
      dropdown={
        <Column
          padding="4"
          gap="2"
          background="surface"
          radius="l"
          border="neutral-alpha-weak"
          minWidth={10}
        >
          {options.map((option) => (
            <Option
              key={option.value}
              value={option.value}
              hasPrefix={<Icon name={option.icon} size="s" />}
              onClick={() => {
                setSelected(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </Option>
          ))}
        </Column>
      }
    />
  );
}
```

---

### useTheme Hook

Dynamic theme switching and management

```typescript
import { useTheme, Button, Flex } from '@once-ui-system/core';

export function ThemeExample() {
  const { theme, setTheme } = useTheme();

  return (
    <Flex gap="16">
      <Button
        variant={theme === 'light' ? 'primary' : 'secondary'}
        onClick={() => setTheme('light')}
      >
        Light
      </Button>

      <Button
        variant={theme === 'dark' ? 'primary' : 'secondary'}
        onClick={() => setTheme('dark')}
      >
        Dark
      </Button>

      <Button
        variant={theme === 'system' ? 'primary' : 'secondary'}
        onClick={() => setTheme('system')}
      >
        System
      </Button>
    </Flex>
  );
}
```

---

### EmojiPicker Component

Emoji selection with categories and search

```typescript
import { EmojiPicker, EmojiPickerDropdown, Button, Flex, Icon } from '@once-ui-system/core';
import { useState } from 'react';

export function EmojiPickerExample() {
  const [emoji, setEmoji] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [dropdownEmoji, setDropdownEmoji] = useState('');

  return (
    <Flex direction="column" gap="24">
      {/* Standard emoji picker */}
      <Flex direction="column" gap="16">
        <Button onClick={() => setShowPicker(!showPicker)}>
          {emoji || "Pick Emoji"}
        </Button>
        {showPicker && (
          <EmojiPicker
            onSelect={(emoji) => {
              setEmoji(emoji);
              setShowPicker(false);
            }}
            onClose={() => setShowPicker(false)}
          />
        )}
      </Flex>

      {/* Emoji picker dropdown */}
      <EmojiPickerDropdown
        trigger={
          <Button variant="secondary">
            <Flex gap="8" align="center">
              {dropdownEmoji || <Icon name="smiley" />}
              <Text>Add Emoji</Text>
            </Flex>
          </Button>
        }
        onSelect={setDropdownEmoji}
        placement="bottom-start"
      />
    </Flex>
  );
}
```

---

### Avatar and AvatarGroup

User profile images with fallback and grouping

```typescript
import { Avatar, AvatarGroup } from '@once-ui-system/core';

export function AvatarExample() {
  return (
    <Flex direction="column" gap="24">
      {/* Single avatars */}
      <Flex gap="16">
        <Avatar size="s" src="/images/user1.jpg" />
        <Avatar size="m" src="/images/user2.jpg" />
        <Avatar size="l" src="/images/user3.jpg" />
        <Avatar size="xl" src="/images/user4.jpg" />
      </Flex>

      {/* Avatar group */}
      <AvatarGroup
        size="m"
        avatars={[
          { src: "/images/user1.jpg" },
          { src: "/images/user2.jpg" },
          { src: "/images/user3.jpg" },
          { src: "/images/user4.jpg" },
          { src: "/images/user5.jpg" }
        ]}
        max={3}
      />
    </Flex>
  );
}
```

---

### Badge Component

Status indicators and labels

```typescript
import { Badge, Logo, Text, Line, LetterFx } from '@once-ui-system/core';

export function BadgeExample() {
  return (
    <Flex gap="16">
      {/* Simple badge */}
      <Badge onBackground="brand-medium">
        <Text>New</Text>
      </Badge>

      {/* Complex badge with logo */}
      <Badge
        textVariant="code-default-s"
        border="neutral-alpha-medium"
        onBackground="neutral-medium"
        vertical="center"
        gap="16"
      >
        <Logo
          wordmark="/trademarks/type-dark.svg"
          href="https://once-ui.com"
          size="xs"
        />
        <Line vert background="neutral-alpha-strong" />
        <Text marginX="4">
          <LetterFx trigger="instant">
            An ecosystem, not a UI kit
          </LetterFx>
        </Text>
      </Badge>
    </Flex>
  );
}
```

---

### MasonryGrid Component

Pinterest-style masonry layouts

```typescript
import { MasonryGrid, Flex, Text } from '@once-ui-system/core';

export function MasonryGridExample() {
  const itemHeights = [16, 6, 4, 6, 16, 12, 7, 24, 4, 12, 6, 2, 24, 17, 12, 5];

  return (
    <MasonryGrid
      columns={4}
      gap="16"
      padding="l"
      radius="l"
      background="neutral-medium"
      m={{ columns: 2 }}
      s={{ columns: 1 }}
    >
      {itemHeights.map((height, index) => (
        <Flex
          key={index}
          background="surface"
          radius="m"
          border="neutral-alpha-medium"
          fill
          center
          height={height}
        >
          <Text>Item {index + 1}</Text>
        </Flex>
      ))}
    </MasonryGrid>
  );
}
```

---

## Summary

Once UI provides a production-ready design system that accelerates Next.js development through its comprehensive component library, intelligent theming system, and rich animation capabilities. The primary use cases include building modern web applications, SaaS products, data dashboards, marketing websites, and documentation portals where visual polish and developer experience are paramount. Its prop-based styling approach eliminates CSS complexity while maintaining full customization through design tokens, responsive breakpoints, and theme providers.

Integration patterns emphasize server/client component optimization for Next.js 13+, centralized theme configuration through context providers, and modular imports for tree-shaking and optimal bundle sizes. The library excels in scenarios requiring rapid prototyping, consistent design systems across large applications, data visualization with interactive charts, and engaging user experiences powered by 15+ animation effects. With TypeScript support, accessibility compliance, and extensive documentation at docs.once-ui.com, Once UI delivers professional-grade UI components suitable for indie projects through enterprise applications, all while maintaining the flexibility to customize every aspect of the design system to match specific brand requirements.
