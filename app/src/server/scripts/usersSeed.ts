import { type User } from 'wasp/entities';
import { faker } from '@faker-js/faker';
import type { PrismaClient } from '@prisma/client';
import { TierIds } from '../../shared/constants.js';

// in a terminal window run `wasp db seed` to seed your dev database with mock user data
export function createRandomUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const user: Omit<User, 'id'> = {
    email: faker.internet.email({
      firstName,
      lastName,
    }),
    username: faker.lorem.paragraph(),
    about: faker.lorem.paragraph(), // Generate a random paragraph for the about field
    fullName: `${firstName} ${lastName}`,
    location: 'Canada',
    isOnboarded: false,
    nativeLanguage: faker.helpers.arrayElement(['English', 'Spanish', 'French', 'German', 'Chinese']),
    portugueseLevel: faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced']),
    learningPurpose: faker.helpers.arrayElement(['travel', 'work', 'personal interest', 'academic']),
    specificGoals: faker.lorem.sentence(),
    preferredLearningStyle: faker.helpers.arrayElement(['visual', 'auditory', 'kinesthetic']),
    interests: faker.lorem.words(5),
    topicsOfInterest: faker.lorem.words(5),
    specialRequirements: faker.lorem.sentence(),
    createdAt: faker.date.between({ from: new Date('2023-01-01'), to: new Date() }),
    lastActiveTimestamp: faker.date.recent(),
    isAdmin: false,
    role: 'student',
    stripeId: `cus_${faker.string.uuid()}`,
    sendEmail: false,
    subscriptionStatus: faker.helpers.arrayElement(['active', 'canceled', 'past_due', 'deleted', null]),
    datePaid: faker.date.recent(),
    credits: faker.number.int({ min: 0, max: 3 }),
    avatarUrl: faker.image.avatar(),
    checkoutSessionId: null,
    subscriptionTier: faker.helpers.arrayElement([TierIds.BASIC, TierIds.STANDARD, TierIds.PREMIUM]),
  };
  return user;
}

const USERS: Omit<User, 'id'>[] = faker.helpers.multiple(createRandomUser, {
  count: 50,
});

export async function devSeedUsers(prismaClient: PrismaClient) {
  try {
    await Promise.all(
      USERS.map(async (user) => {
        await prismaClient.user.create({
          data: user,
        });
      })
    );
  } catch (error) {
    console.error(error);
  }
}
