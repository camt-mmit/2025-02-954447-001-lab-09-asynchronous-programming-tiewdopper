import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { Profile } from '../../types';
import { applyEach, createMetadataKey, form, FormField, metadata } from '@angular/forms/signals';
import { createFriend } from '../../helpers';

@Component({
  selector: 'app-profile-form',
  imports: [FormField],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileForm {
  readonly data = model.required<Profile>();

  protected readonly friendcountkey = createMetadataKey<number>();
  protected readonly friendUcNameKey = createMetadataKey<string>();

  protected readonly form = form(this.data, (path) => {
    metadata(path.friends, this.friendcountkey, ({ value }) => value().length);

    applyEach(path.friends, (path) => {
      metadata(path, this.friendUcNameKey, ({ value }) => value().toLocaleUpperCase());
    });
  });

  protected addFriend(): void {
    this.form.friends().value.update((items) => [...items, createFriend()]);
  }
  protected removeFriend(index: number): void {
    this.form.friends().value.update((items) => items.filter((_item, i) => i !== index));
  }
  protected moveFriend(index: number, offset: number): void {
    this.form
      .friends()
      .value.update((items) =>
        items.map((item, i) =>
          i === index + offset ? items[index] : i === index ? items[index + offset] : item,
        ),
      );
  }
}
