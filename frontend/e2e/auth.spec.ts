import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour le hook useAuth (AuthProvider)
 * Ces tests vérifient le flux d'authentification depuis l'interface utilisateur
 */

test.describe('Authentification (useAuth hook)', () => {
  test('affiche le formulaire de connexion', async ({ page }) => {
    // Arrange & Act
    await page.goto('/connexion');

    // Assert: Vérifier que les champs du formulaire sont présents
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /connexion|se connecter/i }),
    ).toBeVisible();
  });

  test('affiche les erreurs de validation côté client', async ({ page }) => {
    // Arrange
    await page.goto('/connexion');

    // Act: Soumettre le formulaire vide
    await page.getByRole('button', { name: /connexion|se connecter/i }).click();

    // Assert: Des messages d'erreur devraient apparaître
    // Note: Adapter selon les messages d'erreur réels de Zod
    await expect(page.locator('body')).toContainText(
      /requis|invalide|obligatoire/i,
    );
  });

  test('redirige vers inscription depuis connexion', async ({ page }) => {
    // Arrange
    await page.goto('/connexion');

    // Act: Cliquer sur le lien d'inscription
    const signupLink = page.getByRole('link', {
      name: /inscription|créer un compte|s'inscrire/i,
    });
    if (await signupLink.isVisible()) {
      await signupLink.click();

      // Assert: Vérifier la redirection vers /inscription
      await expect(page).toHaveURL(/inscription/);
    }
  });

  test("affiche le formulaire d'inscription avec tous les champs", async ({
    page,
  }) => {
    // Arrange & Act
    await page.goto('/inscription');

    // Assert: Vérifier que tous les champs requis sont présents
    await expect(page.getByLabel(/prénom/i)).toBeVisible();
    await expect(page.getByLabel(/nom/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    // Note: Les champs mot de passe peuvent avoir différents labels
    const passwordFields = page.locator('input[type="password"]');
    await expect(passwordFields).toHaveCount(2); // password + confirmation
  });

  test("valide la correspondance des mots de passe à l'inscription", async ({
    page,
  }) => {
    // Arrange
    await page.goto('/inscription');

    // Act: Remplir avec des mots de passe différents
    await page.getByLabel(/prénom/i).fill('Jean');
    await page.getByLabel(/nom/i).fill('Dupont');
    await page.getByLabel(/email/i).fill('test@example.com');

    const passwordFields = page.locator('input[type="password"]');
    await passwordFields.nth(0).fill('password123');
    await passwordFields.nth(1).fill('different456');

    // Soumettre
    await page
      .getByRole('button', { name: /inscription|s'inscrire|créer/i })
      .click();

    // Assert: Message d'erreur sur la non-correspondance
    await expect(page.locator('body')).toContainText(
      /correspondent pas|ne correspondent pas|mismatch/i,
    );
  });
});

test.describe('Protection des routes (useAuth hook)', () => {
  test('redirige vers connexion si non authentifié', async ({ page }) => {
    // Arrange & Act: Essayer d'accéder à une page protégée
    await page.goto('/mon-profil');

    // Assert: Devrait rediriger vers /connexion
    // Note: Le middleware Next.js devrait gérer cette redirection
    await expect(page).toHaveURL(/connexion/);
  });

  test('redirige vers connexion depuis la page conversation', async ({
    page,
  }) => {
    // Arrange & Act
    await page.goto('/conversation');

    // Assert
    await expect(page).toHaveURL(/connexion/);
  });
});
